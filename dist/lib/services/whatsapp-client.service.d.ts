/// <reference types="node" />
import { EventEmitter } from 'events';
export declare const eventEmitter: EventEmitter;
export declare class WhatsappClient {
    getQr: (phone: string) => void;
    private addClient;
}
declare const _default: WhatsappClient;
export default _default;
export declare const initateEventListners: () => void;
