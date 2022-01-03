interface WhatsappClient {
    phone: string;
    client: any;
    auth: any;
    saveState: any;
}
export declare class Whatsapp {
    constructor();
    private startSock;
    addClient: (phone: string, getQr?: boolean) => Promise<WhatsappClient>;
    getQr: (phone: string) => Promise<void>;
    closeClient: (phone: string) => void;
    removeClient: (phone: string) => boolean | void;
    private startBasicEventListners;
    private reconnectClient;
    private sendMessageWTyping;
}
declare const _default: Whatsapp;
export default _default;
