/// <reference types="node" />
import { EventEmitter } from "events";
import { AuthenticationState } from "@baileys/old";
export default class WhatsappOld extends EventEmitter {
    private logger;
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
    constructor(deviceId: string, phone: string);
}
