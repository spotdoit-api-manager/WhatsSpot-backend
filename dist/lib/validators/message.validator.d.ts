export interface IIsValidMessageType {
    valid: boolean;
    message?: string;
    index?: number[];
}
export declare const isWhatsappTextMessageType: (msg: any) => IIsValidMessageType;
export declare const isWhatsappListMessageType: (msg: any) => IIsValidMessageType;
export declare const isWhatsappButtonMessageType: (msg: any) => IIsValidMessageType;
export declare const isWhatsappTemplateMessageType: (msg: any) => IIsValidMessageType;
export declare const isWhatsappImageBtnMessageType: (msg: any) => IIsValidMessageType;
export declare const isWhatsappImageTemplateMessageType: (msg: any) => IIsValidMessageType;
