export declare const sendMessage: (to: string, message: string) => Promise<{
    proceed: boolean;
    message: any;
} | {
    proceed: boolean;
}>;
export declare const sendNewDeviceCode: (to: string, otp: number) => Promise<{
    proceed: boolean;
    message?: undefined;
} | {
    proceed: boolean;
    message: any;
}>;
