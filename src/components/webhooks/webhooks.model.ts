import { IWebHookMessage } from "./webhooks.interface";
import WebhookMessage, { IWebhookMessageModel } from "./webhooks.schemas";
export class WebhookModel{
    public async createWebhookMessage(userId:string,message: IWebHookMessage): Promise<IWebhookMessageModel> {
        const newMessage = new WebhookMessage({...message,userId});
        return await newMessage.save();
    }
}

export default new WebhookModel();