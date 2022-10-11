import { EWhatsappMessageTypes } from "./../../lib/services/whatsapp/whatsapp.enum";
import { IWhatsappMessage, IWhatsappTextMessage } from "./../../lib/services/whatsapp/whatsapp.interface";
import { IMessage, EMessageStatus } from "./message.interface";
import { IMessageModel } from "./message.schema";
import { IContact, IGroupList } from "../contact/contact.interface";
export declare class MessageModel {
    retryFailedMessage(userId: string, deviceId: string): Promise<{
        error: boolean;
        messageCount: number;
    }>;
    updateMessageStatus: (id: string, status: EMessageStatus, reason?: string) => Promise<void>;
    updateMessageToGroupStatus: (id: string, contact: IContact, status: EMessageStatus, reason?: string) => Promise<void>;
    addMessageToQueue(userId: string, body: {
        groups: IGroupList[];
        numbers: string | string[];
        message: IWhatsappMessage;
        isGroup: boolean;
        messageType: EWhatsappMessageTypes;
    }, deviceId: string): Promise<{
        error: boolean;
        result: IMessageModel[];
        message?: undefined;
    } | {
        error: boolean;
        message: string;
        result?: undefined;
    } | {
        error: boolean;
        messageInfo: IMessageModel[];
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
        result: IMessageModel[];
        message?: undefined;
    } | {
        error: boolean;
        message: string;
        result?: undefined;
    }>;
    fetchGroupMessageSentContacts(messageId: string): Promise<any[]>;
    private hasActivePlan;
    sendFastMessage(userId: string, numbers: string, message: IWhatsappTextMessage, messageType: EWhatsappMessageTypes, deviceId: string, walletId: string): Promise<any[]>;
    sendMessage(userId: string, to: string, message: IWhatsappMessage, messageType: EWhatsappMessageTypes, deviceId: string, walletId: string, transactionId?: string): Promise<{
        error: boolean;
        creditUsed: number;
        message: any;
        walletBalance?: undefined;
    } | {
        error: boolean;
        creditUsed: number;
        walletBalance: number;
        message: any;
    }>;
    sendImageMessage(userId: string, deviceId: string, body: any): Promise<void>;
    saveFastMessage(messageBody: IMessage): Promise<{
        error: boolean;
        data: any;
        message?: undefined;
    } | {
        error: boolean;
        message: string;
        data?: undefined;
    }>;
}
declare const _default: MessageModel;
export default _default;
