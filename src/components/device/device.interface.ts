/* eslint-disable @typescript-eslint/interface-name-prefix */
import { IReason } from "./../../lib/services/whatsapp/whatsapp.interface";


export interface INewDevice{
    name: string;
    phone: string;
}
export interface IDevice {
    name: string;
    phone: string;
    authState: boolean;
    reason: IReason;
    userId: string;
    apiKeys: IApiKey[];
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

export enum EApiKeyStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    EXPIRED = "EXPIRED",
}


export interface IMessageMetrics {
    totalFastError: number;
    totalFastSuccess: number;
    totalQueueError: number;
    totalQueuePending: number;
    totalQueueSuccess: number;
}

export enum EDeviceStatus{
    SENDING="SENDING",
    IDLE="IDLE"
}