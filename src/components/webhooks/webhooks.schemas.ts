import { model, Schema,Types } from "mongoose";
import { EMessageStatus } from "../messages/message.interface";
import { IWebHookMessage } from "./webhooks.interface";

export interface IWebhookMessageModel extends IWebHookMessage, Document {
    metadata:{
        userId:string,
        deviceId:string
    },
    status: EMessageStatus,
}

const WebhookMessageSchema= new Schema({
    message: {
        type: Schema.Types.Mixed,
        required: true,
    },
   
    timestamp:{

    },
    name:{
        type: String
    },
    from:{
        type: String
    },
    status: {
        type: String,
        enum: Object.values(EMessageStatus),
        default: EMessageStatus.SENT
    },
   
    metadata:{
        userId:{
            type: Types.ObjectId,
            ref: "User",
            required:true
        },
        deviceId:{
            type: Types.ObjectId,
            required:true,
            ref: "Device",
        }

    },
    reason: {
        type: String,
    },

}, {
     timestamps: true
    
});

export const WebhookMessage = model<IWebhookMessageModel>("WebhookMessage", WebhookMessageSchema);

export default WebhookMessage;