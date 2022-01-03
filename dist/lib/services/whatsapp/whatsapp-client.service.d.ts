/// <reference types="node" />
import { EventEmitter } from 'events';
export declare const eventEmitter: EventEmitter;
export declare class WhatsappClient {
    getQr: (phone: string) => void;
    addClient: (phone: string) => void;
    initializeAllClients(): Promise<void>;
}
declare const _default: WhatsappClient;
export default _default;
