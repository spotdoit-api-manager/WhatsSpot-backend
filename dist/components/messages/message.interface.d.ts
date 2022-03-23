export interface IMessage {
    message: string;
    to: string;
    status: String;
    phone: string;
    deviceId: string;
    userId: string;
    reason?: string;
    sendType: ESendType;
    isGroup?: boolean;
    contactsSent?: [
        {
            phoneNumber: string;
            status: EMessageStatus;
            reason?: string;
        }
    ];
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
