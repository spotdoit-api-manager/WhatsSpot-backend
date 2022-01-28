import { IReason } from './../../lib/services/whatsapp/whatsapp.interface';
export interface IDevice {
    name: string,
    phone: string,
    authState: boolean,
    reason: IReason,
    userId: string,
    apiKeys: IApiKey[],
}

export interface IApiKey {
    token: string,
    expiresOn: string,
    name: string,
    createdOn: Date,
    status: {
        status: EApiKeyStatus,
        reason: string | null
    }
}

export interface IDeviceTokenData {
    deviceId: string,
    walletId:string,
    userId:string
}

export interface TextMessage {
    message: String,
    numbers: string
}

export enum EApiKeyStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}


export interface IMessageMetrics {
    totalFastError: number
    totalFastSuccess: number
    totalQueueError: number
    totalQueuePending: number
    totalQueueSuccess: number
}