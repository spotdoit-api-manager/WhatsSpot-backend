import { EDeviceStatus, IDeviceTokenData } from '../device/device.interface';
import { IApiKey, IDevice } from "./device.interface";
import { IDeviceModel } from "./device.shema";
export declare class DeviceModel {
    newDevice(userId: string, walletId: any, body: IDevice): Promise<IDeviceModel>;
    private validateDeviceAdd;
    getQr(body: any): Promise<{
        error: boolean;
        message: string;
    } | {
        message: string;
        error?: undefined;
    }>;
    removeClient(body: any): Promise<{
        message: string;
    }>;
    fetchAllDevices: (userId: string) => Promise<any>;
    fetchDevice: (deviceId: string, userId: string) => Promise<any>;
    private fetchDeviceByCondition;
    fetchPrevMessages(deviceId: string): Promise<any>;
    private fetchMessagesByStatus;
    deleteAuth(body: any): Promise<{
        message: string;
    }>;
    logoutDevice(body: any): Promise<{
        message: string;
        device: IDeviceModel;
    }>;
    generateNewKey(userId: string, walletId: string, deviceId: string, body: any): Promise<IApiKey>;
    deleteKey(deviceId: string, keyId: string): Promise<void>;
    getKeys(deviceId: string): Promise<any>;
    private addNewTokenDataToDevice;
    private generateDeviceKey;
    signDeviceToken: (apiKeyData: IDeviceTokenData, expiresIn: string) => string;
    private getTotalAvailableApiKeys;
    updateDevice(phone: string, clientData: any): Promise<void | {
        error: boolean;
        message: string;
    } | {
        error: boolean;
        message?: undefined;
    }>;
    findDeviceByPhone(phone: string): Promise<IDeviceModel>;
    findDeviceById(id: string): Promise<IDeviceModel>;
    findDeviceByUseId(userId: string): Promise<any>;
    findDeviceByCondition(condition: any): Promise<any[]>;
    findDeviceByIdAndUserId(deviceId: string, userId: string): Promise<any>;
    fetchDeviceMetrics(deviceId: string): Promise<any>;
    retryFailedMessage(userId: string, deviceId: string): Promise<{
        error: boolean;
        message: string;
        messageCount: any;
    }>;
    updateDeviceStatus(deviceId: string, status: EDeviceStatus): Promise<IDeviceModel>;
}
declare const _default: DeviceModel;
export default _default;
