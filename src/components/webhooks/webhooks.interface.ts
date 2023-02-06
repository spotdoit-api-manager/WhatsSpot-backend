import { EMessageStatus } from "./../messages/message.interface";

export interface IWebHookMessage{
    message:string,
    timestamp:number,
    from:string,
    name:string,
    status?:EMessageStatus
}

