/// <reference types="node" />
import { EventEmitter } from 'events';
import Whatsapp from './whatsapp.service';
import { IImageMessage } from './whatsapp.interface';
interface IWhatsappClient {
    [phone: string]: WhatsappClient;
}
export declare const eventEmitter: EventEmitter;
export declare class WhatsappClient {
    clients: IWhatsappClient;
    getClientQr: (phone: string) => Promise<void>;
    private removeQrListner;
    logoutClient(phone: string): Promise<{
        error: boolean;
        message?: undefined;
    } | {
        error: boolean;
        message: any;
    }>;
    addClient: (phone: string) => Whatsapp;
    getClient: (phone: string) => any;
    sendTextMessage: (phone: string, to: string, message: string) => Promise<any>;
    sendImageMessage: (phone: string, to: string, msg: IImageMessage) => Promise<any>;
    initializeAllClients(): Promise<void>;
}
declare const _default: WhatsappClient;
export default _default;
