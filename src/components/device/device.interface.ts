import { IReason } from './../../lib/services/whatsapp/whatsapp.interface';
export interface IDevice {
    name: string,
    phone: string,
    authState: boolean,
    reason: IReason,
    userId: string,
    apiKeys: IApiKey[],
}

interface IApiKey {
    token: string,
    expiresOn: string,
    name: string,
    createdOn: string,
    status: {
        status: EApiKeyStatus,
        reason: string | null
    }
}

export interface IDeviceTokenData {
    deviceId: string
}

export interface TextMessage {
    message: String,
    numbers: string
}

export enum EApiKeyStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}
