export declare const sendMail: (to: string, subject: string, text: string, html?: string) => Promise<void>;
export declare const sendNotificationMail: (to: string, subject: string, text: string, html?: string) => Promise<void>;
export declare const sendVerificationMail: (to: string, subject: string, text: string, html: string) => Promise<any>;
