import { EMessageStatus } from './../../../components/messages/message.interface';
import { MessageQueue } from './../../../components/messages/message.schema';
import whatsappClientService from './whatsapp-client.service';

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

    private updateMessageStatus = async (id: string, status: EMessageStatus, reason: string = null) => {
        await MessageQueue.updateOne({ _id: id }, { status: status, reason: reason });
    }

    private async sendPendingMessage(pendingMessages: any) {
        return new Promise(async (resolve) => {

            for (let i = 0; i < pendingMessages.length; i++) {
                const message = pendingMessages[i];
                try {
                    const result: any = await whatsappClientService.sendTextMessage(message.phone, message.to, message.message);
                    if (!result.error) {
                     await this.updateMessageStatus(message._id, EMessageStatus.SENT);
                    }else{
                        await this.updateMessageStatus(message._id, EMessageStatus.ERROR, result.message);
                    }
                } catch (e) {
                    console.log(e);
                    continue;
                }
            }
            
            resolve({ error: false })

        })
    }
}

export default new MessageQueueService()