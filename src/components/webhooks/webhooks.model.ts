import { isValidMongoId } from "./../../lib/helpers/index";
import { EMessageStatus } from "./../messages/message.interface";
import { IWebHookMessage } from "./webhooks.interface";
import WebhookMessage, { IWebhookMessageModel } from "./webhooks.schemas";
export class WebhookModel{
    public async createWebhookMessage(userId:string,message: IWebHookMessage,status:EMessageStatus): Promise<IWebhookMessageModel> {
        const newMessage = new WebhookMessage({...message,userId,status});
        return await newMessage.save();
    }

    public fetchWebhookMessages(userId:string,deviceId?:string): Promise<IWebhookMessageModel[]> {
        const q:any = {userId};
        if(deviceId && deviceId!=="undefined" || deviceId!=="null"){
            isValidMongoId(deviceId);
            q.deviceId = deviceId;
        } 
        return WebhookMessage.find(q).sort({createdAt: -1}).select("-message").lean().exec();
    }
}

// what is .exec() in mongoose?


export default new WebhookModel();