export interface IMessage {
    message: string;
    to: String;
    status: String;
    phone: string;
    deviceId: string;
    reason?: string;
    sendType: ESendType;
}
export declare enum EMessageStatus {
    PENDING = "PENDING",
    SENT = "SENT",
    ERROR = "ERROR"
}
export declare enum ESendType {
    FAST = "FAST",
    QUEUE = "QUEUE"
}
