/// <reference types="node" />
import { IWhatsappListMessage } from "./whatsapp.interface";
import { EventEmitter } from "events";
import Whatsapp from "./whatsapp.service";
import { IImageMessage, IWhatsappTextMessage } from "./whatsapp.interface";
interface IWhatsappClient {
    [phone: string]: number;
}
export declare const eventEmitter: EventEmitter;
export declare class WhatsappClient {
    clients: IWhatsappClient;
    addClient: (phone: string) => Whatsapp;
    getClientInstanceByPhone(phone: string): any;
    getClientInstanceByInstanceId: (instanceId: number) => any;
    logoutClient(phone: string): Promise<{
        error: boolean;
        message?: undefined;
    } | {
        error: boolean;
        message: any;
    }>;
    getClientQr: (phone: string) => Promise<any>;
    removeClientInstanceByPhone(phone: string): {
        error: boolean;
        message: any;
    };
    private removeClientByInstanceId;
    sendTextMessage: (from: string, to: string, message: IWhatsappTextMessage) => Promise<any>;
    sendListMessage: (from: string, to: string, message: IWhatsappListMessage) => Promise<any>;
    sendRawMessage(phone: string, to: string, message: any): Promise<any>;
    sendImageMessage: (phone: string, to: string, msg: IImageMessage) => Promise<any>;
    initializeAllClients(): Promise<void>;
}
declare const _default: WhatsappClient;
export default _default;
