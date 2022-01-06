export declare class MessageQueue {
    getPendingsMessages(limit?: number): Promise<void>;
    private updateMessage;
    private sendPendingMessage;
}
declare const _default: MessageQueue;
export default _default;
