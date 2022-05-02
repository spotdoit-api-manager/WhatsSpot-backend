export declare const sendMessage: (to: string, message: string) => Promise<{
    proceed: boolean;
    message?: undefined;
} | {
    proceed: boolean;
    message: any;
}>;
export declare const sendNewDeviceCode: (to: string) => Promise<{
    proceed: boolean;
    message: any;
} | {
    proceed: boolean;
}>;
