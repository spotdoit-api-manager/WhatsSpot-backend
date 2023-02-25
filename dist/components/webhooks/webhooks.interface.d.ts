import { EMessageStatus } from "./../messages/message.interface";
export interface IWebHookMessage {
    message: string;
    timestamp: number;
    from: string;
    name: string;
    deviceId: string;
    status?: EMessageStatus;
    urls: string[];
}
