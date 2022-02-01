import { EDeviceStatus } from './../../../components/device/device.interface';
import deviceModel from '../../../components/device/device.model';
import messageModel from '../../../components/messages/message.model';
import walletModel from '../../../components/walllet/wallet.model';
import { EMessageStatus, IMessage } from './../../../components/messages/message.interface';
import { MessageQueue, IMessageModel } from './../../../components/messages/message.schema';
import whatsappClientService from './whatsapp-client.service';
import  socketManager from '../socket';

const FETCH_PENDING_INTERVAL = 10;

export class MessageQueueService {
    public async getPendingsMessages(limit: number = 10) {
        const pendingMessages = await MessageQueue.find({ status: EMessageStatus.PENDING }).sort({ _id: 1 }).limit(limit);
        console.log(`FOUND ${pendingMessages.length} PENDING MESSAGES`);
        const data = await this.sendPendingMessage(pendingMessages);
        
        setTimeout(() => {            
            this.getPendingsMessages();
        }, FETCH_PENDING_INTERVAL * 1000);
    }

  


    public async sendPendingMessage(pendingMessages: any) {
        return new Promise(async (resolve) => {

            for (let i = 0; i < pendingMessages.length; i++) {
                const message:IMessageModel = pendingMessages[i];
                try {
                    const walletId = await walletModel.getWalletIdAndValidateTransactionAmount(message.userId,parseFloat(process.env.TEXT_MESSAGE_RATE));
                    const result: any = await whatsappClientService.sendTextMessage(message.phone, message.to as string, message.message);
                    if (!result.error) {
                     await messageModel.updateMessageStatus(message._id, EMessageStatus.SENT);
                     await walletModel.makePaymentFromWallet(walletId,message.userId,parseFloat(process.env.TEXT_MESSAGE_RATE),`sent queue message to ${message.to} from ${message.phone}`,{deviceId:message.deviceId,to:message.to,type:EMessageStatus.PENDING});
                    }else{
                        await messageModel.updateMessageStatus(message._id, EMessageStatus.ERROR, result.message);
                    }
                } catch (e) {
                    console.log(e);
                    await messageModel.updateMessageStatus(message._id, EMessageStatus.ERROR, e.message);
                    continue;
                }
            }
            
            resolve({ error: false })

        })
    }

    public async sendErrorMessageForDevice(errorMessages: IMessageModel[],deviceId:string) {
        return new Promise(async (resolve) => {
            deviceModel.updateDeviceStatus(deviceId,EDeviceStatus.SENDING);

            for (let i = 0; i < errorMessages.length; i++) {
                const message:IMessageModel = errorMessages[i];
                try {
                    const walletId = await walletModel.getWalletIdAndValidateTransactionAmount(message.userId,parseFloat(process.env.TEXT_MESSAGE_RATE));
                    const result: any = await whatsappClientService.sendTextMessage(message.phone, message.to as string, message.message);
                    if (!result.error) {
                     await messageModel.updateMessageStatus(message._id, EMessageStatus.SENT);
                     console.log(i,"th message sent");
                     
                     socketManager.sendFailedMessageSendProgress(deviceId,{total:errorMessages.length,current:i+1});
                     await walletModel.makePaymentFromWallet(walletId,message.userId,parseFloat(process.env.TEXT_MESSAGE_RATE),`sent queue message to ${message.to} from ${message.phone}`,{deviceId:message.deviceId,to:message.to,type:EMessageStatus.ERROR});
                    }else{    
                        socketManager.sendFailedMessageSendProgress(deviceId,{total:errorMessages.length,current:i+1});                    
                        await messageModel.updateMessageStatus(message._id, EMessageStatus.ERROR, result.message);
                    }
                } catch (e) {
                    console.log(e);
                    await messageModel.updateMessageStatus(message._id, EMessageStatus.ERROR, e.message);
                    continue;
                }
            }
            deviceModel.updateDeviceStatus(deviceId,EDeviceStatus.IDLE);
            resolve({ error: false })

        })
    }


}

export default new MessageQueueService()