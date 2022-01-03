/// <reference types="node" />
import { EventEmitter } from 'events';
import { AuthenticationState } from "@adiwajshing/baileys-md";
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
    closeClient: (phone: string) => void;
    removeClient: (phone: string) => boolean | void;
    private startBasicEventListners;
    private reconnectClient;
    private sendMessageWTyping;
}
