import { EPlanStatus } from "./../plans/plans.interface";

import { EWhatsappMessageTypes } from "./../../lib/services/whatsapp/whatsapp.enum";
import { ObjectID } from "bson";
import { IImageMessage, IWhatsappMessage, IWhatsappTextMessage,IWhatsappListMessage, IWhatsappButtonMessage, IWhatsappTemplateMessage } from "./../../lib/services/whatsapp/whatsapp.interface";
import { sanatizeMobile } from "./../../lib/utils/index";
import { validateMobile } from "../../lib/utils";
import { HTTP400Error, HTTP401Error } from "../../lib/utils/httpErrors";
import deviceModel from "../device/device.model";
import { ESendType, IMessage, EMessageStatus } from "./message.interface";
import { MessageQueue, FastMessage, IMessageModel } from "./message.schema";
import whatsappClientService from "../../lib/services/whatsapp/whatsapp-client.service";
import walletModel from "../wallet/wallet.model";
import messageQueueService from "../../lib/services/whatsapp/message-queue.service";
import userModel from "../user/user.model";
import plansModel from "../plans/plans.model";
import { IPLAN, IUserPlan } from "../plans/plans.interface";
import { IPlanModel, IUserPlanModel } from "../plans/plans.schema";
import { IContact, IGroupList } from "../contact/contact.interface";
import logger from "../../core/logger";
import { parsePhone } from "../../lib/utils/phone.handler";

const logFileName = "[MessageModel] : ";
export class MessageModel {

    public async retryFailedMessage(userId: string, deviceId: string) {
        const messages = await MessageQueue.find({ userId: new ObjectID(userId), deviceId: new ObjectID(deviceId), status: EMessageStatus.ERROR });
        logger.info(logFileName, `Found ${messages.length} Failed Messages for user ${userId}`);
        messageQueueService.sendErrorMessageForDevice(messages, deviceId);
        if (messages) return { error: false, messageCount: messages.length };
        throw new HTTP401Error("NO_MESSAGES_FOUND");
    }

    public updateMessageStatus = async (id: string, status: EMessageStatus, reason: string = null) => {
        await MessageQueue.updateOne({ _id: id }, { status: status, reason: reason });
    }

    public updateMessageToGroupStatus = async (id: string, contact: IContact, status: EMessageStatus, reason: string = null) => {
        await MessageQueue.updateOne({ _id: id }, { $push: { contactsSent: { phoneNumber: contact.phoneNumber, name: contact.name, status: status, reason: reason } } });
    }


    public async addMessageToQueue(userId: string, body: { groups: IGroupList[]; numbers: string | string[]; message: IWhatsappMessage; isGroup: boolean;messageType: EWhatsappMessageTypes }, deviceId: string) {
        logger.debug(logFileName,"add to queue request", body, deviceId);
        const device = await deviceModel.findDeviceById(userId,deviceId);
        if (!device) throw new HTTP400Error("DEVICE_NOT_FOUND");

        const messagesBody: IMessage[] = [];
        if (body.isGroup) {
            body.groups.forEach((group: IGroupList) => {
                const newBody: IMessage = { phone: device.phone, userId, deviceId: deviceId, sendType: ESendType.QUEUE, to: group._id,messageType:body.messageType, message: body.message, status: EMessageStatus.PENDING, isGroup: true };
                messagesBody.push(newBody);
            });
            return await this.addMultipleMessageToQueue(messagesBody);
        }

        const numbers = [];
        if (typeof (body.numbers) === "string") {
            numbers.push(body.numbers);
        } else {
            body.numbers.forEach((phone: any) => {
               const parsedPhone = parsePhone(phone);
                numbers.push(parsedPhone.number);
            });
        }

        for (let i = 0; i < numbers.length; i++) {
            const to = numbers[i];
            const newBody: IMessage = { phone: device.phone, userId, deviceId: deviceId, sendType: ESendType.QUEUE, to,messageType:body.messageType, message: body.message, status: EMessageStatus.PENDING };
            messagesBody.push(newBody);
        }

        const result = await this.addMultipleMessageToQueue(messagesBody);
        if (result && result.error) {
            throw new HTTP401Error(result.message);
        }
        delete messagesBody[0].to;
        return { error: false, messageInfo: result.result, numbers };
    }


    public async addSingleMessageToQueue(messageBody: IMessage) {
        const newMessage = new MessageQueue(messageBody);
        const data = newMessage.addMessage();
        if (data) {
            return { error: false };
        }
        return { error: true, message: "NOT_ADDED" };
    }

    public async addMultipleMessageToQueue(messages: IMessage[]) {
        const result = await MessageQueue.insertMany(messages);
        if (result) {
            return { error: false,result };
        }
        return { error: true, message: "NOT_ADDED" };
    }
    public async fetchGroupMessageSentContacts(messageId: string) {
        const result = await MessageQueue.aggregate([
            { $match: { _id: new ObjectID(messageId) } },
            {
                $project: {
                    contactsSent: 1
                }
            }
        ]);
        // console.log("sent contact ",result);
        return result;
    }

    private async hasActivePlan(userId: string) {
        const userCurrentPlan: IUserPlanModel|null = await userModel.fetchUserActivePlan(userId);
        if (userCurrentPlan) {
            const isMessageOver = userCurrentPlan.planStatus==EPlanStatus.EXHAUSTED;
            return { hasActivePlan: true, isMessageOver:userCurrentPlan.planStatus, activePlanInfo: userCurrentPlan};
        }
        return { hasActivePlan: false };
    }

    // private isPlanReachedMaxMessage(userCurrentPlan) {

    // }

    public async sendFastMessage(userId: string, numbers: string|string[], message: IWhatsappTextMessage,messageType: EWhatsappMessageTypes,deviceId: string, walletId: string) {
        
        const device = await deviceModel.findDeviceById(userId,deviceId);
        if (!device) throw new HTTP400Error("DEVICE_NOT_FOUND");
        const results=[];
        if(typeof numbers == "string"){
            const parsedNumber = parsePhone(numbers).number;
            const result = await this.sendMessage(userId, parsedNumber as string, message,messageType, deviceId, walletId);
            const newBody: IMessage = { phone: device.phone, userId, to:parsedNumber, reason: result?.message, sendType: ESendType.FAST,messageType:EWhatsappMessageTypes.TEXT_MESSAGE, message: message, deviceId: deviceId, status: result.error ? EMessageStatus.ERROR : EMessageStatus.SENT };
            const saveResult = await this.saveFastMessage(newBody);
            results.push({...result,messageInfo:saveResult.data});
        }else if(typeof numbers == "object"){
            numbers.forEach((number: string,index: number)=>{
                const to = parsePhone(number).number;
            });
            for(let i=0;i<numbers.length;i++){
                const to = parsePhone(numbers[i]).number;
                const result = await this.sendMessage(userId, to, message,messageType, deviceId, walletId);
                results.push({...result,messageInfo:{phone:device.phone,message,to:numbers,messageType:EWhatsappMessageTypes.TEXT_MESSAGE,userId,deviceId}});
                const newBody: IMessage = { phone: device.phone, userId, to, reason: result?.message, sendType: ESendType.FAST,messageType:EWhatsappMessageTypes.TEXT_MESSAGE, message: message, deviceId: deviceId, status: result.error ? EMessageStatus.ERROR : EMessageStatus.SENT };
            const saveResult = await this.saveFastMessage(newBody);
            results.push({...result,messageInfo:saveResult.data});
            }

        }else{
            throw new HTTP400Error("INVALID_NUMBER_TYPE");
        }
        logger.info(logFileName,results);
        return results;
    }
    public async sendMessage(userId: string, to: string, message: IWhatsappTextMessage,messageType: EWhatsappMessageTypes, deviceId: string, walletId: string) {
        try {
            const device = await deviceModel.findDeviceById(userId,deviceId);
            if (!device) throw new HTTP400Error("DEVICE_NOT_FOUND");
            const { hasActivePlan, isMessageOver, activePlanInfo } = await this.hasActivePlan(userId);
            if (isMessageOver) throw new HTTP400Error("MESSAGES_EXHAUSTED", "message exhausted for your active plan");
            logger.info(logFileName, `User ${userId} hasPlanActive: ${hasActivePlan}`);
            if (!hasActivePlan) {
                const { isValidAmount, balance } = await walletModel.validateTransactionAmount(walletId, parseFloat(process.env.TEXT_MESSAGE_RATE));
                // logger.debug(logFileName, `validAMount ${isValidAmount}`);
                if (!isValidAmount) throw new Error("NOT_ENOUGH_BALANCE");
            }
            const result = await this.sendTypeMessage(messageType,message,device.phone,to);
            if(result.error) throw Error(result.message);
            if (hasActivePlan) {
                await plansModel.increamentMessageCount(activePlanInfo._id);
                return { error: false, creditUsed: 0, message: result.message };
            } else {
                const paymentMetaData = { deviceId: deviceId, to: to };
                const paymentResult = await walletModel.makePaymentFromWallet(walletId, userId, parseFloat(process.env.TEXT_MESSAGE_RATE), `message to ${to} from device ${device.name}(${device.phone})`, paymentMetaData);
                return { error: false, creditUsed: parseFloat(process.env.TEXT_MESSAGE_RATE), walletBalance: paymentResult.wallet.balance,message:result.message };
            }
        } catch (err) {
            logger.error(logFileName, err);
            throw new HTTP400Error(err.message);
        }
    }




    public async sendImageMessage(userId: string, deviceId: string,body: any,) {
        const device = await deviceModel.findDeviceById(userId,deviceId);
        if (!device) throw new HTTP400Error("DEVICE_NOT_FOUND");
        const to = parsePhone(body.to).number;
        const msg: IImageMessage = { image: body.locationUrl, caption: body.caption || "" };
        const result = await whatsappClientService.sendImageMessage(device.phone, to, msg);
        // console.log(result);
    }
    public async saveFastMessage(messageBody: IMessage) {
        const newMessage = new FastMessage(messageBody);
        const data = await newMessage.addMessage();
        if (data) {
            return { error: false,data };
        }
        return { error: true, message: "NOT_ADDED" };
    }

    public async sendTypeMessage(messageType: EWhatsappMessageTypes,message: IWhatsappMessage,from: string,to: string){
        console.log("sending type message ",messageType);
        
        switch(messageType){
            case EWhatsappMessageTypes.TEXT_MESSAGE:
                return await whatsappClientService.sendTextMessage(from, to, message as IWhatsappTextMessage);
            case EWhatsappMessageTypes.LIST_MESSAGE:
                return await whatsappClientService.sendListMessage(from, to, message as IWhatsappListMessage);    
            case EWhatsappMessageTypes.BUTTON_MESSAGE:
                return await whatsappClientService.sendButtonMessage(from, to, message as IWhatsappButtonMessage);    
            case EWhatsappMessageTypes.TEMPLATE_MESSAGE:
                 return await whatsappClientService.sendTemplateMessage(from, to, message as IWhatsappTemplateMessage);    

        }
    }

}
export default new MessageModel();