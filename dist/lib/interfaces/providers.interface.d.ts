export interface PlivoCredentials {
    authId: string;
    authToken: string;
    sourceNumber: string;
}
export interface Fast2SmsCredentials {
    authToken: string;
    url: string;
    senderId: string;
}
export interface WhatsappConfig {
    apiKey: string;
    baseApi: string;
    messageApi: string;
}
