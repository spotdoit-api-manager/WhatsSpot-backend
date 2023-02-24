import { IPaginationData } from "./../../lib/interfaces/response.interface";
import { createPaginationData } from "./../../lib/utils/index";
import { isValidMongoId } from "./../../lib/helpers/index";
import { EMessageStatus } from "./../messages/message.interface";
import { IWebHookMessage } from "./webhooks.interface";
import WebhookMessage, { IWebhookMessageModel } from "./webhooks.schemas";
export class WebhookModel{
    public async createWebhookMessage(userId:string,message: IWebHookMessage,status:EMessageStatus): Promise<IWebhookMessageModel> {
        const newMessage = new WebhookMessage({...message,userId,status});
        return await newMessage.save();
    }

    public async fetchWebhookMessages(userId:string,deviceId?:string,page=1): Promise<IPaginationData<IWebhookMessageModel[]>> {
        const limit = 20;
        const q:any = {userId};
        if(deviceId && deviceId!=="undefined" || deviceId!=="null"){
            isValidMongoId(deviceId);
            q.deviceId = deviceId;
        } 
        const result = await WebhookMessage.find(q).sort({createdAt: -1}).skip((page-1)*limit).limit(limit).lean().exec();
        const total = await WebhookMessage.countDocuments(q);
        return createPaginationData(result,page,total,limit);
    }
}

// what is .exec() in mongoose?


export default new WebhookModel();