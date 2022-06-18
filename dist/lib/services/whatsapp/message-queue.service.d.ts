import { IMessageModel } from "./../../../components/messages/message.schema";
export declare class MessageQueueService {
    constructor();
    getPendingMessagesToContacts(limit?: number): Promise<void>;
    getPendingMessagesToGroup(limit?: number): Promise<void>;
    private MGCSPF_Counter;
    sendPendingMessageToGroup(pendingMessages: IMessageModel[]): Promise<void>;
    sendPendingMessageToContacts(pendingMessages: any): Promise<unknown>;
    sendErrorMessageForDevice(errorMessages: IMessageModel[], deviceId: string): Promise<unknown>;
    private updateMessagePriority;
}
declare const _default: MessageQueueService;
export default _default;
