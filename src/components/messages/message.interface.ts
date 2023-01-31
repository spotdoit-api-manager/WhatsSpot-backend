
import { EWhatsappMessageTypes } from "./../../lib/services/whatsapp/whatsapp.enum";
import { IWhatsappMessage, IWhatsappTextMessage } from "./../../lib/services/whatsapp/whatsapp.interface";

export interface IMessage {
    messageType:EWhatsappMessageTypes;
    message: IWhatsappMessage,
    to: string ,
    status: string,
    phone: string
    deviceId: string,
    userId:string,
    reason?: string,
    sendType: ESendType,
    isGroup?:boolean
    contactsSent?:[{
        phoneNumber: string,
         status:EMessageStatus,
         reason?:string
    }],
    priority?: number
}

export interface IScheduleMessage extends IMessage{
    scheduleTime: Date;
}

export enum EMessageStatus {
    PENDING = "PENDING",
    SENT = "SENT",
    ERROR = "ERROR"
}
export enum ESendType {
    FAST = "FAST",
    QUEUE = "QUEUE",
    SCHEDULE = "SCHEDULE"
}


export interface IWebHookMessage{
    text:string,
    timestamp:number,
    from:string,
    name:string
}

