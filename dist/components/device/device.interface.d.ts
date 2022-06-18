import { CountryCode } from "libphonenumber-js/max";
import { IReason } from "./../../lib/services/whatsapp/whatsapp.interface";
export interface INewDevice {
    name: string;
    country: CountryCode;
    phone: string;
}
export interface IDevice {
    name: string;
    phone: string;
    country: CountryCode;
    authState: boolean;
    reason: IReason;
    userId: string;
    isDeleted: IDeviceDeleted;
    apiKeys: IApiKey[];
}
export interface IDeviceDeleted {
    status: boolean;
}
export interface IApiKey {
    token: string;
    expiresOn: Date;
    name: string;
    createdOn: Date;
    status: {
        status: EApiKeyStatus;
        reason: string | null;
    };
}
export interface IDeviceTokenData {
    deviceId: string;
    walletId: string;
    userId: string;
}
export interface TextMessage {
    message: string;
    numbers: string;
}
export declare enum EApiKeyStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    EXPIRED = "EXPIRED"
}
export interface IMessageMetrics {
    totalFastError: number;
    totalFastSuccess: number;
    totalQueueError: number;
    totalQueuePending: number;
    totalQueueSuccess: number;
}
export declare enum EDeviceStatus {
    SENDING = "SENDING",
    IDLE = "IDLE"
}
