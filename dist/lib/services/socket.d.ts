import { IMessageProgress } from "../interfaces/socket.interface";
interface QRData {
    error: boolean;
    qr: string;
    reason?: string;
}
export declare class SocketManager {
    socketServer: (server: any) => Promise<void>;
    sendClientError: (phone: string, error: any) => import("winston").Logger;
    sendQrCode: (phone: string, qrData: QRData) => import("winston").Logger;
    sendAuthenticated: (phone: string) => import("winston").Logger;
    sendQrRetryExceed: (data: {
        phone: string;
    }) => import("winston").Logger;
    sendConnectionClosed: (data: {
        phone: string;
        reason: string;
    }) => import("winston").Logger;
    sendError: (data: {
        phone: string;
        reason: string;
    }) => import("winston").Logger;
    sendLoggedOut(data: {
        phone: string;
    }): import("winston").Logger;
    sendFailedMessageSendProgress(deviceId: string, progressData: IMessageProgress): import("winston").Logger;
    sendFailedMessageSendComplete(data: {
        deviceId: string;
    }): import("winston").Logger;
}
declare const _default: SocketManager;
export default _default;
