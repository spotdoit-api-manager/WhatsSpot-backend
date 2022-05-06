/// <reference types="node" />
import { IButtonMessage, IImageMessage, IWhatsappListMessage, IWhatsappTextMessage } from "./whatsapp.interface";
import { EventEmitter } from "events";
import { AuthenticationState } from "@adiwajshing/baileys";
export default class Whatsapp extends EventEmitter {
    client: any;
    phone: string;
    state: AuthenticationState;
    saveState: any;
    authState: boolean;
    qrInProcess: boolean;
    qrRequested: boolean;
    _instanceId: number;
    private retryCount;
    constructor(phone: string);
    initiClient: () => Promise<{
        error: boolean;
        message?: undefined;
    } | {
        error: boolean;
        message: any;
    }>;
    getQr: () => Promise<void>;
    private checkIfQrRetryExceeded;
    private startBasicEventListners;
    private isMaxRetryReached;
    private reconnectClient;
    private getDisconnectReason;
    private handleConnectionOpen;
    private handleConnectionClose;
    private sendMessageWTyping;
    sendTextMessage: (to: string, msg: IWhatsappTextMessage) => Promise<{
        error: boolean;
        message?: undefined;
    } | {
        error: boolean;
        message: any;
    }>;
    sendListMessage: (to: string, msg: IWhatsappListMessage) => Promise<{
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
    sendRawMessage: (to: string, msg: any) => Promise<{
        error: boolean;
    }>;
    sendBtnMessage: (to: string, btnMsg: IButtonMessage) => Promise<{
        error: boolean;
    }>;
    sendTemplateMessage: (to: string, templateMsg: IButtonMessage) => Promise<{
        error: boolean;
    }>;
    endClient(): void;
    logoutClient(): Promise<{
        error: boolean;
        message?: undefined;
    } | {
        error: boolean;
        message: any;
    }>;
}
