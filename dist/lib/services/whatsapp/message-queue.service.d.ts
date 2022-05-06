import { IMessageModel } from "./../../../components/messages/message.schema";
export declare class MessageQueueService {
    constructor();
    getPendingMessagesToContacts(limit?: number): Promise<void>;
    getPendingMessagesToGroup(limit?: number): Promise<void>;
    sendPendingMessageToGroup(pendingMessages: IMessageModel[]): Promise<void>;
    sendPendingMessageToContacts(pendingMessages: any): Promise<unknown>;
    sendErrorMessageForDevice(errorMessages: IMessageModel[], deviceId: string): Promise<unknown>;
}
declare const _default: MessageQueueService;
export default _default;
