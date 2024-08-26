/// <reference types="node" />
import { IWhatsappTextMessage } from "./whatsapp.interface";
import { EventEmitter } from "events";
import { AuthenticationState } from "@whiskeysockets/baileys";
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
    private logger;
    private msgRetryCounterCache;
    constructor(deviceId: string, phone: string);
    initialSetup(): Promise<void>;
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
    private destroyClient;
    getDeviceStatus(): Promise<{
        status: boolean;
    }>;
    private handleConnectionOpen;
    private deleteAuthFiles;
    private handleConnectionClose;
    private updateDeviceStatus;
    sendAnyMessage: (to: string, msg: IWhatsappTextMessage) => Promise<{
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
