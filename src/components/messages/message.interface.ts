
export interface IMessage {
    message: string,
    to: String,
    status: String,
    phone: string
    deviceId: string,
    userId:string,
    reason?: string,
    sendType: ESendType
}

export enum EMessageStatus {
    PENDING = "PENDING",
    SENT = "SENT",
    ERROR = "ERROR"
}
export enum ESendType {
    FAST = "FAST",
    QUEUE = "QUEUE"
}