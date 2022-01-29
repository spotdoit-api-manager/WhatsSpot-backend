import { IMessage } from './message.interface';
export declare class MessageModel {
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
