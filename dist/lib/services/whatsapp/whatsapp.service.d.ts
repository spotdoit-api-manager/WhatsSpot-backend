/// <reference types="node" />
import { EventEmitter } from "events";
import { AnyMessageContent, AuthenticationState } from "@adiwajshing/baileys-md";
export default class Whatsapp extends EventEmitter {
    client: any;
    phone: string;
    state: AuthenticationState;
    saveState: any;
    authState: boolean;
    qr: any;
    constructor(phone: string);
    private startSock;
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
}
