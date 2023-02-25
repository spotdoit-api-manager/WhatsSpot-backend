import { IPaginationData } from "./../../lib/interfaces/response.interface";
import { EMessageStatus } from "./../messages/message.interface";
import { IWebHookMessage } from "./webhooks.interface";
import { IWebhookMessageModel } from "./webhooks.schemas";
export declare class WebhookModel {
    createWebhookMessage(userId: string, message: IWebHookMessage, status: EMessageStatus): Promise<IWebhookMessageModel>;
    fetchWebhookMessages(userId: string, deviceId?: string, page?: number): Promise<IPaginationData<IWebhookMessageModel[]>>;
}
declare const _default: WebhookModel;
export default _default;
