import { IMessageProgress } from "../interfaces/socket.interface";
interface QRData {
    error: boolean;
    qr: string;
    reason?: string;
}
export declare class SocketManager {
    socketServer: (server: any) => Promise<void>;
    sendClientError: (phone: string, error: any) => void;
    sendQrCode: (phone: string, qrData: QRData) => void;
    sendAuthenticated: (phone: string) => void;
    sendQrRetryExceed: (data: any) => void;
    sendConnectionClosed: (data: any) => void;
    sendError: (data: any) => void;
    sendLoggedout(data: any): void;
    sendFailedMessageSendProgress(deviceId: string, progressData: IMessageProgress): void;
    sendFailedMessageSendComplete(data: any): void;
}
declare const _default: SocketManager;
export default _default;
