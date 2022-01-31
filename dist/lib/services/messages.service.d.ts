export declare class MessagesService {
    private _whatsappConfig;
    private _plivoClient;
    constructor();
    sendWhatsappMessage(fullNumber: string, message: string): Promise<any>;
    sendWhatsappMessageFast(fullNumber: string, message: string): Promise<any>;
    sendSMS(fullNumber: string, message: string): Promise<void>;
    sendFast2Sms(number: string, message: string): Promise<any>;
}
declare const _default: MessagesService;
export default _default;
