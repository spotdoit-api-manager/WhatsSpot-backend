import { HTTP400Error } from '../../lib/utils/httpErrors';
import { IMessage } from './message.interface';
import { Message } from "./message.schema";

export class MessageModel{
    public async addMessageToQueue(messageBody:IMessage){
        const newMessage =new  Message(messageBody);
        let data = newMessage.addMessage()
        if(data){
            return {error:false}
        }
        return {error:true,message:"NOT_ADDED"};
    }
}
export default new MessageModel();