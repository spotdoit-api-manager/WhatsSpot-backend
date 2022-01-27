export declare class MessageQueueService {
    getPendingsMessages(limit?: number): Promise<void>;
    private updateMessageStatus;
    private sendPendingMessage;
}
declare const _default: MessageQueueService;
export default _default;
