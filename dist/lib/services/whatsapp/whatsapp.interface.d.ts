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
            buttonId: String;
            buttonText: {
                displayText: string;
            };
            type: Number;
        }
    ];
    text: string;
    footer: String;
    headerType: Number;
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
