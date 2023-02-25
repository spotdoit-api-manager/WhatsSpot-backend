/// <reference types="mongoose" />
import { EMessageStatus } from "../messages/message.interface";
import { IWebHookMessage } from "./webhooks.interface";
export interface IWebhookMessageModel extends IWebHookMessage, Document {
    status: EMessageStatus;
}
export declare const WebhookMessage: import("mongoose").Model<IWebhookMessageModel, {}, {}>;
export default WebhookMessage;
