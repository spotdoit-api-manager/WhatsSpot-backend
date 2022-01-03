export declare const socketServer: (server: any) => Promise<void>;
export declare const sendClientError: (phone: string, error: any) => void;
export declare const sendQrCode: (phone: string, qr: string) => void;
export declare const sendQrRetryExceed: (data: any) => void;
export declare const sendConnectionClosed: (data: any) => void;
export declare const sendError: (data: any) => void;
