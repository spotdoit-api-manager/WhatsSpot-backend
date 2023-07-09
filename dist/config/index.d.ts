import { PlivoCredentials, Fast2SmsCredentials } from "./../lib/interfaces/providers.interface";
import { ITestMessageConfig } from "./config.interface";
export declare const mongoUrl: () => string;
export declare const groupMessageDefaultGap = 10;
export declare const configCors: {
    adminAllowOrigin: string[];
    allowOrigin: string[];
    exposedHeaders: string[];
};
export declare const rateLimitConfig: {
    inTime: string | number;
    maxRequest: string | number;
};
export declare const commonConfig: {
    jwtSecretKey: string;
    pageSizeLimit: number;
    domain: string;
    backendUrl: string;
    deviceNotUsedMaxDay: number;
};
export declare const deviceKeyConfig: {
    jwtSecretKey: string;
    expiresIn: string;
};
export declare const textLocalConfig: {
    apiKey: string;
};
export declare const mailazyConfig: {
    accessKey: string;
    accessSecret: string;
};
export declare const stripeConfig: {
    secretKey: string;
    publishableKey: string;
    webhookSecretKey: string;
    API: string;
};
export declare const s3Config: {
    accessKey: string;
    secretKey: string;
    sign: string;
    region: string;
    url: string;
};
export declare const paginationConfig: {
    MAX_NEWS: number;
    MAX_VIDEOS: number;
    MAX_POLL: number;
    MAX_POST: number;
    MAX_TIMELINE: number;
    MAX_LIKES: number;
    MAX_COMMENTS: number;
    MAX_REPLIES: number;
    MAX_USERS: number;
    MAX_AWARDS: number;
    MAX_NOTIFICATIONS: number;
};
export declare const googleOAuth: {
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    REDIRECT: string;
};
export declare const razorPaySecrets: {
    key: string;
    secret: string;
};
export declare const pilvoConfig: PlivoCredentials;
export declare const fast2SmsConfig: Fast2SmsCredentials;
export declare const testMessageConfig: ITestMessageConfig;
