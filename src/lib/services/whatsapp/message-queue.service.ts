
import { EDeviceStatus } from "./../../../components/device/device.interface";
import deviceModel from "../../../components/device/device.model";
import messageModel from "../../../components/messages/message.model";
import walletModel from "../../../components/wallet/wallet.model";
import { EMessageStatus } from "./../../../components/messages/message.interface";
import { MessageQueue, IMessageModel } from "./../../../components/messages/message.schema";
import  socketManager from "../socket";
import contactModel from "../../../components/contact/contact.model";
import { IContact } from "../../../components/contact/contact.interface";
import logger from "../../../core/logger";
import { final } from "pino";
import { delay } from "@whiskeysockets/baileys";
import { groupMessageDefaultGap } from "../../../config";
import { getRandomNumber } from "../../../lib/utils";
const FETCH_PENDING_INTERVAL = 10;
const logFileName = "[MessageQueueService] : ";

// making it 1 so that there can be added delay in sending messages to group
const MGCSPF= 1;//+process.env.MGCSPF || 2;//mag group contact send per fetch;
export class MessageQueueService {


    public start(){
        this.getPendingMessagesToContacts();
        this.getPendingMessagesToGroup();
    }
    public async getPendingMessagesToContacts(limit: number = 10) {
        const pendingMessagesToContacts = await MessageQueue.find({ status: EMessageStatus.PENDING,isGroup: false}).sort({ _id: 1 }).limit(limit);
        logger.info(logFileName,`FOUND ${pendingMessagesToContacts.length} PENDING MESSAGES TO CONTACT`);
        const result = await this.sendPendingMessageToContacts(pendingMessagesToContacts);
        setTimeout(() => {            
            this.getPendingMessagesToContacts();
        }, FETCH_PENDING_INTERVAL * 1000);
    }

    public async getPendingMessagesToGroup(limit: number = 20) {
        // i have updatedAt field and timeGapInSecs field fetch all messages where updatedAt is less than or equal to current time - timeGapInSecs

        try{

            const r = getRandomNumber(5,20);
            console.log("Random Number is ",r);
        const pendingMessagesToGroup = await MessageQueue.aggregate([
           
              {
                $addFields: {
                  timeDifferenceInSeconds: {
                    $divide: [{ $subtract: [ { $toLong: new Date() },{ $toLong: {$toDate:"$updatedAt"} },] }, 1000],
                  },
                  randomGap: {
                    $add: [ "$messageGap",getRandomNumber(5,20) ],
                  },
                 
                }
              },
              {
                $addFields: {
                    isEligible: {
                        $cond: {
                            if: { $gte: [  "$timeDifferenceInSeconds","$randomGap"] },
                            then: true,
                            else: false,
                        }
                      }
                    }
              },
          
            {
                $match: {
                    status: EMessageStatus.PENDING,
                    isGroup: true,
                    isEligible:true
                    // timeDifferenceInSeconds: { $gte: "$messageGap" },
                    // updatedAt: { $lte: "$thresholdTime" }
                    // updatedAt: {  $lt: new Date(new Date().getTime() - groupMessageDefaultGap * 1000) }
                  
                }
            },
            {   
                $sort: { _id: 1,priority:1 }
            },
            {
                $limit: limit
            }

        ]);

        // console.log(pendingMessagesToGroup);
        // const pendingMessagesToGroup = await MessageQueue.find({ status: EMessageStatus.PENDING,isGroup: true,...updateAtQuery}).sort({ _id: 1,priority:1 }).limit(limit);
        logger.info(logFileName,`FOUND ${pendingMessagesToGroup.length} PENDING MESSAGES TO GROUP`);
        const resultGroupContact = await this.sendPendingMessageToGroup(pendingMessagesToGroup);
    }
        catch(e){
            console.log(e);
        }finally{

            setTimeout(() => {            
                this.getPendingMessagesToGroup();
            }, FETCH_PENDING_INTERVAL * 1000);
        }
    }

    private MGCSPF_Counter = 0;
      // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
      public async sendPendingMessageToGroup(pendingMessages: IMessageModel[]){
          for(let i =0;i<pendingMessages.length;i++){
              const message: IMessageModel = pendingMessages[i];
              const groupId = message.to;
            const userId = message.userId;
            const groupContacts: IContact[] = await contactModel.fetchGroupContacts(userId,groupId);
            const walletId = (await walletModel.getWalletIdByUserId(message.userId));
            const contactsSent = message.contactsSent || [];
            await this.updateMessagePriority(message._id,message?.priority || 0);

            let anyContactError = false;
              this.MGCSPF_Counter =0;
            for(let c=0;c<groupContacts.length;c++){
                if(this.MGCSPF_Counter>=MGCSPF){
                    console.log(logFileName,`SENDING PENDING MESSAGE TO GROUP ${groupId} CONTACT REACHED ${MGCSPF} LIMIT`);
                    break;
                }
                const contact: IContact = groupContacts[c];
                const idx = contactsSent.findIndex((c: IContact)=>c.phoneNumber==contact.phoneNumber);
                if(idx>-1 && (contactsSent[idx].status==EMessageStatus.SENT) ) continue;
                this.MGCSPF_Counter++;
               
                try {
                    const body = {to:contact.phoneNumber,message:message.message};
                    const result: any = await messageModel.sendMessage(message.userId,body.to,body.message,message.messageType,message.deviceId,walletId);
                    console.log(logFileName,`SENDING PENDING MESSAGE TO GROUP ${groupId} CONTACT ${contact.phoneNumber}`);
                    if (result.error) {
                        anyContactError = true;
                        await messageModel.updateMessageToGroupStatus(message._id,contact, EMessageStatus.ERROR, result.message);
                        //  await walletModel.makePaymentFromWallet(walletId,message.userId,parseFloat(process.env.TEXT_MESSAGE_RATE),`sent queue message to ${message.to} from ${message.phone}`,{deviceId:message.deviceId,to:message.to,type:EMessageStatus.PENDING});
                    }else{
                        await messageModel.updateMessageToGroupStatus(message._id,contact, EMessageStatus.SENT);
                    }
                } catch (e) {
                    anyContactError = true;
                    await messageModel.updateMessageToGroupStatus(message._id,contact, EMessageStatus.ERROR, e.message);
                    continue;
                }finally{
                    // await delay(messageGap);
                }
            }
            
            if(contactsSent.length == groupContacts.length){
                await messageModel.updateMessageStatus(message._id, anyContactError?EMessageStatus.ERROR:EMessageStatus.SENT);
            }
        }        
    }
  
    public async sendPendingMessageToContacts(pendingMessages: any) {
        return new Promise(async (resolve) => {

            for (let i = 0; i < pendingMessages.length; i++) {
                const message: IMessageModel = pendingMessages[i];
                try {
                    const walletId = (await walletModel.getWalletIdByUserId(message.userId));
                    const body = {to:message.to,message:message.message};
                    const result: any = await messageModel.sendMessage(message.userId,body.to,body.message,message.messageType,message.deviceId,walletId);
                    if (!result.error) {
                     await messageModel.updateMessageStatus(message._id, EMessageStatus.SENT);
                    //  await walletModel.makePaymentFromWallet(walletId,message.userId,parseFloat(process.env.TEXT_MESSAGE_RATE),`sent queue message to ${message.to} from ${message.phone}`,{deviceId:message.deviceId,to:message.to,type:EMessageStatus.PENDING});
                    }else{
                        await messageModel.updateMessageStatus(message._id, EMessageStatus.ERROR, result.message);
                    }
                } catch (e) {
                    await messageModel.updateMessageStatus(message._id, EMessageStatus.ERROR, e.message);
                    continue;
                }
            }
            
            resolve({ error: false });

        });
    }




    public async sendErrorMessageForDevice(errorMessages: IMessageModel[],deviceId: string) {
        return new Promise(async (resolve) => {
            await deviceModel.updateDeviceStatus(deviceId,EDeviceStatus.SENDING);
            for (let i = 0; i < errorMessages.length; i++) {
                const message: IMessageModel = errorMessages[i];
                logger.info(logFileName,`Sending failed message ${message._id}`);
                try {
                    // const walletId = await walletModel.getWalletIdAndValidateTransactionAmount(message.userId,parseFloat(process.env.TEXT_MESSAGE_RATE));
                    const walletId = await walletModel.getWalletIdByUserId(message.userId);
                    logger.info("got wallet id ",walletId);
                    const result: any = await messageModel.sendMessage(message.userId,message.to,message.message,message.messageType,message.deviceId,walletId);

                    // const result: any = await whatsappClientService.sendTextMessage(message.phone, message.to as string, message.message);
                    if (!result.error) {
                     await messageModel.updateMessageStatus(message._id, EMessageStatus.SENT);
                     
                     socketManager.sendFailedMessageSendProgress(deviceId,{total:errorMessages.length,current:i+1});
                    //  await walletModel.makePaymentFromWallet(walletId,message.userId,parseFloat(process.env.TEXT_MESSAGE_RATE),`sent queue message to ${message.to} from ${message.phone}`,{deviceId:message.deviceId,to:message.to,type:EMessageStatus.ERROR});
                    }else{    
                        socketManager.sendFailedMessageSendProgress(deviceId,{total:errorMessages.length,current:i+1});                    
                        await messageModel.updateMessageStatus(message._id, EMessageStatus.ERROR, result.message);
                    }
                } catch (e) {
                    logger.error(logFileName,e);
                    await messageModel.updateMessageStatus(message._id, EMessageStatus.ERROR, e.message);
                    continue;
                }
            }
            deviceModel.updateDeviceStatus(deviceId,EDeviceStatus.IDLE);
            resolve({ error: false });

        });
    }
    
    private async updateMessagePriority(messageId: string,priority: number){
        await MessageQueue.findByIdAndUpdate(messageId, {$inc:{priority:-1}});
    }
}

export default new MessageQueueService();