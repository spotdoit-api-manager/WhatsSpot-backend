import { MessageQueue } from './../../../components/messages/message.schema';
import whatsappClientService from './whatsapp-client.service';

const FETCH_PENDING_INTERVAL = 10;

export class MessageQueueService {
    public async getPendingsMessages(limit: number = 10) {
        const pendingMessages = await MessageQueue.find({ status: "pending" }).sort({ _id: 1 }).limit(limit);

        const data = await this.sendPendingMessage(pendingMessages);
        setTimeout(() => {
            this.getPendingsMessages();
        }, FETCH_PENDING_INTERVAL * 1000);
    }
    private updateMessage = async (id: string) => {
        await MessageQueue.updateOne({ _id: id }, { status: 'sent' });
    }

    private async sendPendingMessage(pendingMessages: any) {
        return new Promise(async (resolve) => {

            for (let i = 0; i < pendingMessages.length; i++) {
                const message = pendingMessages[i];
                try {
                    whatsappClientService.sendTextMessage(message.phone, message.to, message.message);
                    await this.updateMessage(message._id);

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