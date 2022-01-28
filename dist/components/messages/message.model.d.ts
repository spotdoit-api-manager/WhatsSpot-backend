import { IMessage } from './message.interface';
export declare class MessageModel {
    addMessageToQueue(messageBody: IMessage): Promise<{
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
    addFastMessage(messageBody: IMessage): Promise<{
        error: boolean;
        message?: undefined;
    } | {
        error: boolean;
        message: string;
    }>;
}
declare const _default: MessageModel;
export default _default;
