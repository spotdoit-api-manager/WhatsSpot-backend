/// <reference types="node" />
import { IWebHook } from "./../../../components/device/device.interface";
import { IWhatsAppIMageButtonMessage, IWhatsappImageTemplateMessage } from "./whatsapp.interface";
import { IWhatsappListMessage, IWhatsappButtonMessage, IWhatsappTemplateMessage, IWhatsappMessage } from "./whatsapp.interface";
import { EventEmitter } from "events";
import { IImageMessage, IWhatsappTextMessage } from "./whatsapp.interface";
import { EWhatsappMessageTypes } from "./whatsapp.enum";
interface IWhatsappClient {
    [phone: string]: number;
}
export declare const eventEmitter: EventEmitter;
export declare class WhatsappClient {
    clients: IWhatsappClient;
    addClient: (deviceId: string, phone: string) => Promise<any>;
    getClientStatus(phone: string): any;
    getClientInstanceByPhone(phone: string): any;
    getClientInstanceByInstanceId: (instanceId: number) => any;
    logoutClient(phone: string): Promise<{
        error: boolean;
        message?: undefined;
    } | {
        error: boolean;
        message: any;
    }>;
    getClientQr: (deviceId: string, phone: string) => Promise<any>;
    removeClientInstanceByPhone(phone: string): {
        error: boolean;
        message: any;
    };
    private removeClientByInstanceId;
    sendTextMessage: (from: string, to: string, message: IWhatsappTextMessage) => Promise<any>;
    sendListMessage: (from: string, to: string, message: IWhatsappListMessage) => Promise<any>;
    sendButtonMessage: (from: string, to: string, message: IWhatsappButtonMessage) => Promise<any>;
    sendTemplateMessage: (from: string, to: string, message: IWhatsappTemplateMessage) => Promise<any>;
    sendImageButtonMessage: (from: string, to: string, message: IWhatsAppIMageButtonMessage) => Promise<any>;
    sendImageTemplateMessage: (from: string, to: string, message: IWhatsappImageTemplateMessage) => Promise<any>;
    sendRawMessage(phone: string, to: string, message: any): Promise<any>;
    sendImageMessage: (phone: string, to: string, msg: IImageMessage) => Promise<any>;
    sendTypeMessage(messageType: EWhatsappMessageTypes, message: IWhatsappMessage, from: string, to: string): Promise<any>;
    initializeAllClients(): Promise<void>;
    subscribeNewWebHook(userId: string, walletId: string, webHook: IWebHook, phone: string): void;
    unsubscribeWebHook(userId: string, walletId: string, webHooks: IWebHook[], phone: string): void;
    private subscribeClientMessage;
    private sendWebHookRequest;
    private whatsAppToWebHookMessage;
    private checkIfOldSessionPresent;
}
declare const _default: WhatsappClient;
export default _default;
