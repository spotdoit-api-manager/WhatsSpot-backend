export interface IReason {
    statusCode?: number;
    message?: string;
    error?: string;
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
