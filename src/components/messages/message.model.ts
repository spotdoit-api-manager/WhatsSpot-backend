import { isValidMongoId } from "./../../lib/helpers/index";
import { IScheduleMessageModel } from "./message.schema";
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { EPlanStatus } from "./../plans/plans.interface";

import { EWhatsappMessageTypes } from "./../../lib/services/whatsapp/whatsapp.enum";
import { ObjectID } from "bson";
import { IImageMessage, IWhatsappMessage, IWhatsappTextMessage,IWhatsappListMessage, IWhatsappButtonMessage, IWhatsappTemplateMessage } from "./../../lib/services/whatsapp/whatsapp.interface";
import { getRandomNumber, sanatizeMobile } from "./../../lib/utils/index";
import { validateMobile } from "../../lib/utils";
import { HTTP400Error, HTTP401Error } from "../../lib/utils/httpErrors";
import { ESendType, IMessage, EMessageStatus, IScheduleMessage } from "./message.interface";
import { MessageQueue, FastMessage, IMessageModel, ScheduleMessage } from "./message.schema";
import whatsappClientService from "../../lib/services/whatsapp/whatsapp-client.service";
import walletModel from "../wallet/wallet.model";
// import messageQueueService from "../../lib/services/whatsapp/message-queue.service";
import userModel from "../user/user.model";
import plansModel from "../plans/plans.model";
import { IPLAN, IUserPlan } from "../plans/plans.interface";
import { IPlanModel, IUserPlanModel } from "../plans/plans.schema";
import { IContact, IGroupList } from "../contact/contact.interface";
import logger from "../../core/logger";
import { parsePhone } from "../../lib/utils/phone.handler";
import deviceUtils from "../device/device.utils";
import messageQueueService from "../../lib/services/whatsapp/message-queue.service";
import scheduleService from "../../lib/services/schedule.service";
import planManagerService from "../../lib/services/plan.manager.service";
import { groupMessageDefaultGap } from "../../config";

const logFileName = "[MessageModel] : ";
export class MessageModel {

    public async retryFailedMessage(userId: string, deviceId: string) {
        const messages = await MessageQueue.find({ userId: userId, deviceId: deviceId, status: EMessageStatus.ERROR });
        logger.info(logFileName, `Found ${messages.length} Failed Messages for user ${userId}`);
        messageQueueService.sendErrorMessageForDevice(messages, deviceId);
        if (messages) return { error: false, messageCount: messages.length };
        throw new HTTP401Error("NO_MESSAGES_FOUND");
    }

    public updateMessageStatus = async (id: string, status: EMessageStatus, reason: string = null) => {
        await MessageQueue.updateOne({ _id: id }, { status: status, reason: reason });
    }
    

    public updateMessageToGroupStatus = async (id: string, contact: IContact, status: EMessageStatus, reason: string = null) => {
        await MessageQueue.updateOne({ _id: id,"contactsSent.phoneNumber":{$ne:contact.phoneNumber} }, { $addToSet: { contactsSent: { phoneNumber: contact.phoneNumber, name: contact?.name, status: status, reason: reason } } });
    }


    public async addMessageToQueue(userId: string, body: { groups: IGroupList[]; numbers: string | string[]; message: IWhatsappMessage; isGroup: boolean;messageType: EWhatsappMessageTypes,messageGap?:number }, deviceId: string) {
        logger.debug(logFileName,"add to queue request", body, deviceId);
        const device = await deviceUtils.findDeviceById(userId,deviceId);
        if (!device) throw new HTTP400Error("DEVICE_NOT_FOUND");
        const messagesBody: IMessage[] = [];
        if (body.isGroup) {
            body.groups.forEach((group: IGroupList) => {
                const newBody: IMessage = { phone: device.phone, userId, deviceId: deviceId, sendType: ESendType.QUEUE, to: group._id,messageType:body.messageType, message: body.message, status: EMessageStatus.PENDING, isGroup: true ,messageGap:body?.messageGap || groupMessageDefaultGap};
                messagesBody.push(newBody);
                console.log("newBody",newBody);
                return;
            });
            return await this.addMultipleMessageToQueue(messagesBody);
        }

        const numbers = [];
        if (typeof (body.numbers) === "string") {
            numbers.push(body.numbers);
        } else {
            (body.numbers as string[]).forEach((phone: any) => {
               const parsedPhone = parsePhone(phone);
                numbers.push(parsedPhone.number);
            });
        }

        for (let i = 0; i < numbers.length; i++) {
            const to = numbers[i];
            const newBody: IMessage = { phone: device.phone, userId, deviceId: deviceId, sendType: ESendType.QUEUE, to,messageType:body.messageType, message: body.message, status: EMessageStatus.PENDING,messageGap:body.messageGap || groupMessageDefaultGap };
            messagesBody.push(newBody);
        }

        const result = await this.addMultipleMessageToQueue(messagesBody);
        if (result && result.error) {
            throw new HTTP401Error(result.message);
        }
        delete messagesBody[0].to;
        return { error: false, messageInfo: result.result, numbers };
    }

    public async scheduleMessage(userId: string, body: { groups: IGroupList[]; numbers: string | string[]; message: IWhatsappMessage; isGroup: boolean; scheduleTime: Date;messageType: EWhatsappMessageTypes,messageGap?:number}, deviceId: string) {
        const scheduleTime = new Date(body.scheduleTime);
        if(!scheduleTime) throw new HTTP400Error("INVALID_SCHEDULE_TIME", "Schedule time is invalid");
        const currentTime = new Date();
        const diff = scheduleTime.getTime() - currentTime.getTime();
        const preMin = 1;
        if(diff < preMin*60*1000 ) throw new HTTP400Error("INVALID_SCHEDULE_TIME", "Schedule time should be in future and more than 5 minutes");

        logger.debug(logFileName,"schedule message request", body, deviceId);
        const device = await deviceUtils.findDeviceById(userId,deviceId);
        if (!device) throw new HTTP400Error("DEVICE_NOT_FOUND");

        const messagesBody: IScheduleMessage[] = [];
        if (body.isGroup) {
            body.groups.forEach((group: IGroupList) => {
                const newBody: IScheduleMessage = { phone: device.phone, userId, deviceId: deviceId, sendType: ESendType.SCHEDULE, to: group._id,messageType:body.messageType, message: body.message, status: EMessageStatus.PENDING, isGroup: true, scheduleTime,messageGap:body?.messageGap || groupMessageDefaultGap };
                messagesBody.push(newBody);
            });
            return await this.addMultipleScheduleMessage(messagesBody);
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
            const newBody: IScheduleMessage = { phone: device.phone, userId, deviceId: deviceId, sendType: ESendType.SCHEDULE, to,messageType:body.messageType, message: body.message, status: EMessageStatus.PENDING, scheduleTime,messageGap:body.messageGap || groupMessageDefaultGap};
            messagesBody.push(newBody);
        }

        const result = await this.addMultipleScheduleMessage(messagesBody);
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

    public async addMultipleScheduleMessage(messages: IScheduleMessage[]) {
        const result = await ScheduleMessage.insertMany(messages);
        // get inserted records
        const insertedRecords:IScheduleMessageModel[] = await ScheduleMessage.find({ _id: { $in: result.map((item) => item._id) } });
        scheduleService.scheduleMessages(insertedRecords);
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



    

    public async sendFastMessage(userId: string, numbers: string, message: IWhatsappTextMessage,messageType: EWhatsappMessageTypes,deviceId: string, walletId: string) {
        if(typeof numbers !== "string") throw new HTTP401Error("FAST_LIMIT","fast messages can be only send to 1 contacts per request , please send to single contact in req body");

        const device = await deviceUtils.findDeviceById(userId,deviceId);
        if (!device) throw new HTTP400Error("DEVICE_NOT_FOUND");
        const results=[];
            const parsedNumber = parsePhone(numbers).number;
            const result = await this.sendMessage(userId, parsedNumber as string, message,messageType, deviceId, walletId);
            const newBody: IMessage = { phone: device.phone, userId, to:parsedNumber, reason: result?.message, sendType: ESendType.FAST,messageType, message: message, deviceId: deviceId, status: result.error ? EMessageStatus.ERROR : EMessageStatus.SENT };
            const saveResult = await this.saveFastMessage(newBody);
            results.push({...result,messageInfo:saveResult.data});
        
        return results;
    }
    public async sendMessage(userId: string, to: string, message: IWhatsappMessage,messageType: EWhatsappMessageTypes, deviceId: string, walletId: string,transactionId: string=null) {
        try {
            console.log("Sending message to: ", to);
            const device = await deviceUtils.findDeviceById(userId,deviceId);
            if (!device) throw new HTTP400Error("DEVICE_NOT_FOUND");
            device.lastUsed = new Date();
            device.save();
            const { hasActivePlan, isMessageOver, activePlanInfo } = await planManagerService.hasActivePlan(userId);
            if (isMessageOver) throw new HTTP400Error("MESSAGES_EXHAUSTED", "message exhausted for your active plan");
            if (!hasActivePlan) {
                const { isValidAmount, balance } = await walletModel.validateTransactionAmount(walletId, parseFloat(process.env.TEXT_MESSAGE_RATE));
                if (!isValidAmount) throw new Error("NOT_ENOUGH_BALANCE");
            }
            const result = await whatsappClientService.sendTypeMessage(messageType,message,device.phone,to);
            if(result.error) throw Error(result.message);
            if (hasActivePlan) {
                 plansModel.increamentMessageCount(activePlanInfo._id);
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
        const device = await deviceUtils.findDeviceById(userId,deviceId);
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

   

}
export default new MessageModel();