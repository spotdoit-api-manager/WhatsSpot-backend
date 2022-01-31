export declare const sendMessage: (to: string, message: string) => Promise<{
    proceed: boolean;
    message: any;
} | {
    proceed: boolean;
}>;
