import { ObjectID } from 'bson';
import { IImageMessage } from './../../lib/services/whatsapp/whatsapp.interface';
import { sanatizeMobile } from './../../lib/utils/index';
import { validateMobile } from '../../lib/utils';
import { HTTP400Error, HTTP401Error } from '../../lib/utils/httpErrors';
import deviceModel from '../device/device.model';
import { ESendType, IMessage, EMessageStatus } from './message.interface';
import { MessageQueue, FastMessage, IMessageModel } from './message.schema';
import whatsappClientService from '../../lib/services/whatsapp/whatsapp-client.service';
import walletModel from '../walllet/wallet.model';
import messageQueueService from '../../lib/services/whatsapp/message-queue.service';
import userModel from '../user/user.model';
import plansModel from '../plans/plans.model';
import { IPLAN, IUserPlan } from '../plans/plans.interface';
import { IPlanModel, IUserPlanModel } from '../plans/plans.schema';
import { IContact, IGroupList } from '../contact/contact.interface';

export class MessageModel {

    public async retryFailedMessage(userId: string, deviceId: string) {
        const messages = await MessageQueue.find({ userId: new ObjectID(userId), deviceId: new ObjectID(deviceId), status: EMessageStatus.ERROR });
        console.log("messsages are ", messages.length);
        messageQueueService.sendErrorMessageForDevice(messages, deviceId);
        if (messages) return { error: false, messageCount: messages.length };
        throw new HTTP401Error("NO_MESSAGES_FOUND")
    }

    public updateMessageStatus = async (id: string, status: EMessageStatus, reason: string = null) => {
        await MessageQueue.updateOne({ _id: id }, { status: status, reason: reason });
    }

    public updateMessageToGroupStatus = async (id: string,contact:IContact, status: EMessageStatus, reason: string = null) => {
        await MessageQueue.updateOne({ _id: id },{$push:{contactsSent:{phoneNumber:contact.phoneNumber,name:contact.name, status: status, reason: reason }}});
    }


    public async addMessageToQueue(userId: string, body: {groups:IGroupList[],numbers:string|IContact[],message:string,isGroup:boolean}, deviceId: string) {
        console.log("add to queue request", body, deviceId);
        const device = await deviceModel.findDeviceById(deviceId);
        if (!device) throw new HTTP400Error("DEVICE_NOT_FOUND");

        const messagesBody: IMessage[] = [];
        if(body.isGroup){
            body.groups.forEach((group:IGroupList)=>{
                const newBody: IMessage = { phone: device.phone, userId, deviceId: deviceId, sendType: ESendType.QUEUE, to:group._id, message: body.message, status: EMessageStatus.PENDING,isGroup:true }
                messagesBody.push(newBody);
            });
            return await this.addMultipleMessageToQueue(messagesBody);
        }

        let numbers = [];
        if (typeof (body.numbers) === 'string') {
            numbers.push(body.numbers);
        } else {
            body.numbers.forEach((contact:IContact) =>{
                numbers.push(contact.phoneNumber);
            })
        }

        for (let i = 0; i < numbers.length; i++) {
            const to = sanatizeMobile(numbers[i]);
            if (!validateMobile(to)) throw new HTTP400Error(`${numbers[i]} is not valid Number at index ${i}`);
            const newBody: IMessage = { phone: device.phone, userId, deviceId: deviceId, sendType: ESendType.QUEUE, to, message: body.message, status: EMessageStatus.PENDING }
            messagesBody.push(newBody);
        }

        const result = await this.addMultipleMessageToQueue(messagesBody);
        if (result && result.error) {
            throw new HTTP401Error(result.message);
        }
        delete messagesBody[0].to;
        return { error: false, message: messagesBody[0], numbers }
    }


    public async addSingleMessageToQueue(messageBody: IMessage) {
        const newMessage = new MessageQueue(messageBody);
        let data = newMessage.addMessage()
        if (data) {
            return { error: false }
        }
        return { error: true, message: "NOT_ADDED" };
    }

    public async addMultipleMessageToQueue(messages: IMessage[]) {
        const result = await MessageQueue.insertMany(messages);
        if (result) {
            return { error: false }
        }
        return { error: true, message: "NOT_ADDED" };
    }
    public async fetchGroupMessageSentContacts(messageId:string){
        const result = await MessageQueue.aggregate([
            {$match:{_id:new ObjectID(messageId)}},
            {$project:{
                contactsSent:1
            }}
        ]);
        // console.log("sent contact ",result);
        return result
    }

    private async hasActivePlan(userId: string) {
        const userCurrentPlan:{activePlanInfo:IUserPlanModel,planInfo:IPlanModel} = await userModel.fetchUserActivePlan(userId);
        if (userCurrentPlan && userCurrentPlan.activePlanInfo){ 
            const isMessageOver:boolean = !Boolean(userCurrentPlan.planInfo.planMaxMessage - userCurrentPlan.activePlanInfo.sentMessageCount);
            console.log(`isMessageOver is ${isMessageOver}`);
            
            return { hasActivePlan: true,isMessageOver, activePlanInfo:userCurrentPlan.activePlanInfo,planInfo:userCurrentPlan.planInfo };
        }
        return { hasActivePlan: false }
    }

private isPlanReachedMaxMessage(userCurrentPlan){
    
}

    public async sendTextMessage(userId: string, body: any, deviceId: string, walletId: string) {
        try {
            body.to = sanatizeMobile(body.to);
            if (!validateMobile(body.to)) throw new HTTP401Error(`INVALID_NUMBER`);
            const device = await deviceModel.findDeviceById(deviceId);
            if (!device) throw new HTTP400Error("DEVICE_NOT_FOUND");
            const { hasActivePlan,isMessageOver, activePlanInfo,planInfo } = await this.hasActivePlan(userId);
            if(isMessageOver) throw new HTTP400Error("MESSAGES_EXHAUSTED","message exhausted for your active plan")
            if (!hasActivePlan) {
                await walletModel.validateTransactionAmount(walletId, parseFloat(process.env.TEXT_MESSAGE_RATE));
            }
            const result = await whatsappClientService.sendTextMessage(device.phone, body.to, body.message);
            const newBody: IMessage = { phone: device.phone, userId, to: body.to, reason: result?.message, sendType: ESendType.FAST, message: body.message, deviceId: deviceId, status: result.error ? EMessageStatus.ERROR : EMessageStatus.SENT }
            await this.saveFastMessage(newBody);
            // console.log(result);
            if (result.error) {
                throw new HTTP401Error(result.message);
            }
            if (hasActivePlan) {
                await plansModel.increamentMessageCount(activePlanInfo._id);
                return { error: false, message: newBody, creditUsed: 0 }
            } else {
                const paymentMetaData = { deviceId: deviceId, to: newBody.to };
                const paymentResult = await walletModel.makePaymentFromWallet(walletId, userId, parseFloat(process.env.TEXT_MESSAGE_RATE), `message to ${newBody.to} from device ${device.name}(${device.phone})`, paymentMetaData);
                return { error: false, message: newBody, creditUsed: process.env.TEXT_MESSAGE_RATE, walletBalance: paymentResult.wallet.balance }
            }
        } catch (err) {
            throw new HTTP400Error(err.message);
        }
    }




    public async sendImageMessage(body: any, deviceId: string) {
        const device = await deviceModel.findDeviceById(deviceId);
        if (!device) throw new HTTP400Error("DEVICE_NOT_FOUND");
        const to = body.to;
        const msg: IImageMessage = { image: body.locationUrl, caption: body.caption || '' };
        const result = await whatsappClientService.sendImageMessage(device.phone, to, msg);
        // console.log(result);
    }
    public async saveFastMessage(messageBody: IMessage) {
        const newMessage = new FastMessage(messageBody);
        let data = await newMessage.addMessage()
        if (data) {
            return { error: false }
        }
        return { error: true, message: "NOT_ADDED" };
    }
}
export default new MessageModel();