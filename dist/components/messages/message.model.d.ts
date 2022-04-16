import { IMessage, EMessageStatus } from './message.interface';
import { IContact, IGroupList } from '../contact/contact.interface';
export declare class MessageModel {
    retryFailedMessage(userId: string, deviceId: string): Promise<{
        error: boolean;
        messageCount: number;
    }>;
    updateMessageStatus: (id: string, status: EMessageStatus, reason?: string) => Promise<void>;
    updateMessageToGroupStatus: (id: string, contact: IContact, status: EMessageStatus, reason?: string) => Promise<void>;
    addMessageToQueue(userId: string, body: {
        groups: IGroupList[];
        numbers: string | IContact[];
        message: string;
        isGroup: boolean;
    }, deviceId: string): Promise<{
        error: boolean;
        message?: undefined;
    } | {
        error: boolean;
        message: string;
    } | {
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
    fetchGroupMessageSentContacts(messageId: string): Promise<any[]>;
    private hasActivePlan;
    private isPlanReachedMaxMessage;
    sendFastTextMessage(userId: string, to: string, messageText: string, deviceId: string, walletId: string): Promise<void>;
    sendTextMessage(userId: string, to: string, messageText: string, deviceId: string, walletId: string): Promise<any>;
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
