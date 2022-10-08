export interface IReason {
    statusCode?: number;
    message?: string;
    error?: string;
}
export declare type IWhatsappMessage = IWhatsappListMessage | IWhatsappTextMessage;
export interface IWhatsappTextMessage {
    text: string;
}
export interface IImageMessage {
    image: string;
    caption: string;
}
export interface IButtonMessage {
    buttons: [
        {
            buttonId: string;
            buttonText: {
                displayText: string;
            };
            type: number;
        }
    ];
    text: string;
    footer: string;
    headerType: number;
}
export interface IWhatsappButtonMessage {
    text: string;
    footer: string;
    buttons: IWhatsappButtonMessageButton[];
    headerType: number;
}
export interface IWhatsappButtonMessageButton {
    buttonId: string;
    buttonText: {
        displayText: string;
    };
    type: number;
}
export interface IWhatsappListMessage {
    title: string;
    text: string;
    footer: string;
    buttonText: string;
    sections: IWhatsappListSection[];
}
export interface IWhatsappListSection {
    title: string;
    rows: IWhatsappListSectionRow[];
}
export interface IWhatsappListSectionRow {
    title: string;
    rowId: string;
    description?: string;
}
export interface IWhatsappContactMessage {
    displayName: string;
    vcard: string | null;
}
export interface IWhatsappTemplateMessage {
    text: string;
    footer: string;
    templateButtons: ITemplateButtons[];
}
export declare type ITemplateButtons = IURLButton | ICallButton | IQuickReplyButton;
export declare enum ETemplateButtons {
    URL_BUTTON = "URL_BUTTON",
    CALL_BUTTON = "CALL_BUTTON",
    QUICK_REPLY_BUTTON = "QUICK_REPLY_BUTTON"
}
export interface IURLButton {
    index: number;
    urlButton: {
        displayText: string;
        url: string;
    };
}
export interface ICallButton {
    index: number;
    callButton: {
        displayText: string;
        phoneNumber: string;
    };
}
export interface IQuickReplyButton {
    index: number;
    quickReplyButton: {
        displayText: string;
        id: string;
    };
}
