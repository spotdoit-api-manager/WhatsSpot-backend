import { IMessageModel } from './../../../components/messages/message.schema';
export declare class MessageQueueService {
    getPendingsMessages(limit?: number): Promise<void>;
    sendPendingMessage(pendingMessages: any): Promise<unknown>;
    sendErrorMessageForDevice(errorMessages: IMessageModel[], deviceId: string): Promise<unknown>;
}
declare const _default: MessageQueueService;
export default _default;
