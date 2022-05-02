export declare class OTPMessagesService {
    sendFast2Sms(number: string, message: string): Promise<{
        proceed: boolean;
        message?: undefined;
    } | {
        proceed: boolean;
        message: any;
    }>;
    sendTextLocalMessage: (to: string, message: string) => Promise<{
        proceed: boolean;
    } | {
        proceed: boolean;
    }>;
}
declare const _default: OTPMessagesService;
export default _default;
