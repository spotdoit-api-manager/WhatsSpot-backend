/// <reference types="node" />
import { IImageMessage } from './whatsapp.interface';
import { EventEmitter } from "events";
import { AnyMessageContent, AuthenticationState } from "@adiwajshing/baileys-md";
export default class Whatsapp extends EventEmitter {
    client: any;
    phone: string;
    state: AuthenticationState;
    saveState: any;
    authState: boolean;
    qr: any;
    _instanceId: number;
    constructor(phone: string);
    initiClient: () => Promise<{
        error: boolean;
        message?: undefined;
    } | {
        error: boolean;
        message: any;
    }>;
    getQr: () => Promise<void>;
    private startBasicEventListners;
    private reconnectClient;
    private sendMessageWTyping;
    sendTextMessage: (to: string, msg: AnyMessageContent) => Promise<{
        error: boolean;
        message?: undefined;
    } | {
        error: boolean;
        message: any;
    }>;
    sendMediaMessage: (to: string, msg: IImageMessage) => Promise<{
        error: boolean;
        message?: undefined;
    } | {
        error: boolean;
        message: any;
    }>;
    endClient(): void;
    logoutClient(): void;
}
