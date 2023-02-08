/// <reference types="node" />
import { IWhatsappMessage } from "./whatsapp.interface";
import { EventEmitter } from "events";
import { AuthenticationState } from "@adiwajshing/baileys";
export default class Whatsapp extends EventEmitter {
    client: any;
    phone: string;
    deviceId: string;
    state: AuthenticationState;
    saveState: any;
    authState: boolean;
    qrInProcess: boolean;
    qrRequested: boolean;
    _instanceId: number;
    private retryCount;
    private removed;
    private firstConnect;
    private logger;
    private interval;
    constructor(deviceId: string, phone: string);
    private initRefreshInterval;
    private closeRefreshInterval;
    initiClient: (notify?: boolean) => Promise<{
        error: boolean;
        message?: undefined;
    } | {
        error: boolean;
        message: any;
    }>;
    getQr: () => Promise<void>;
    private checkIfQrRetryExceeded;
    private handleSockEvents;
    private handleConnectionEvent;
    private handleMessageEvent;
    private startBasicEventListners;
    private isMaxRetryReached;
    private reconnectClient;
    private getDisconnectReason;
    private destroyClient;
    getDeviceStatus(): Promise<void | {
        status: boolean;
    }>;
    private handleConnectionOpen;
    private deleteAuthFile;
    private handleConnectionClose;
    private updateDeviceStatus;
    sendAnyMessage: (to: string, msg: IWhatsappMessage) => Promise<{
        error: boolean;
        message?: undefined;
    } | {
        error: boolean;
        message: any;
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
