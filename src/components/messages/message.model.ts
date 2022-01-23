import { HTTP400Error } from '../../lib/utils/httpErrors';
import { IMessage } from './message.interface';
import { MessageQueue, FastMessage } from './message.schema';

export class MessageModel {
    public async addMessageToQueue(messageBody: IMessage) {
        const newMessage = new MessageQueue(messageBody);
        let data = newMessage.addMessage()
        if (data) {
            return { error: false }
        }
        return { error: true, message: "NOT_ADDED" };
    }
    public async addFastMessage(messageBody: IMessage) {
        const newMessage = new FastMessage(messageBody);
        let data = await newMessage.addMessage()
        if (data) {
            return { error: false }
        }
        return { error: true, message: "NOT_ADDED" };
    }
}
export default new MessageModel();