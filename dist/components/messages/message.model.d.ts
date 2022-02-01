import { IMessage, EMessageStatus } from './message.interface';
export declare class MessageModel {
    retryFailedMessage(userId: string, deviceId: string): Promise<{
        error: boolean;
        messageCount: number;
    }>;
    updateMessageStatus: (id: string, status: EMessageStatus, reason?: string) => Promise<void>;
    addMessageToQueue(userId: string, body: any, deviceId: string): Promise<{
        error: boolean;
        message: IMessage;
        numbers: any[];
    }>;
    addSingleMessageToQueue(messageBody: IMessage): Promise<{
        error: boolean;
        message?: undefined;
    } | {
        error: boolean;
        message: string;
    }>;
    addMultipleMessageToQueue(messages: IMessage[]): Promise<{
        error: boolean;
        message?: undefined;
    } | {
        error: boolean;
        message: string;
    }>;
    sendTextMessage(userId: string, body: any, deviceId: string, walletId: string): Promise<{
        error: boolean;
        message: IMessage;
        creditUsed: string;
        walletBalance: number;
    }>;
    sendImageMessage(body: any, deviceId: string): Promise<void>;
    saveFastMessage(messageBody: IMessage): Promise<{
        error: boolean;
        message?: undefined;
    } | {
        error: boolean;
        message: string;
    }>;
}
declare const _default: MessageModel;
export default _default;
