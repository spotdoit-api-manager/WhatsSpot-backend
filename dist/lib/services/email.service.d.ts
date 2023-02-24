export declare const sendMail: (to: string, subject: string, text: string, html?: string) => Promise<import("winston").Logger>;
export declare const sendNotificationMail: (to: string, subject: string, text: string, html?: string) => Promise<import("winston").Logger>;
export declare const sendVerificationMail: (to: string, subject: string, text: string, html: string) => Promise<any>;
