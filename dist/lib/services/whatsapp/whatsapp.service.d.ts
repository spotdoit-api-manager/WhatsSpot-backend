/// <reference types="node" />
import { IImageMessage } from './whatsapp.interface';
import { EventEmitter } from "events";
import { AnyMessageContent, AuthenticationState } from "@adiwajshing/baileys";
export default class Whatsapp extends EventEmitter {
    client: any;
    phone: string;
    state: AuthenticationState;
    saveState: any;
    authState: boolean;
    qrInProcess: boolean;
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
