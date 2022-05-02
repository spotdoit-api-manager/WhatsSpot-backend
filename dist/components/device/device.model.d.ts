import { EDeviceStatus, IDeviceTokenData, INewDevice } from "../device/device.interface";
import { IApiKey, IDevice } from "./device.interface";
import { IDeviceModel } from "./device.shema";
export declare class DeviceModel {
    newDevice(userId: string, walletId: string, body: IDevice, newDeviceCode: string): Promise<IDeviceModel>;
    verifyNewDeviceCode(newDeviceCode: string): Promise<boolean>;
    newDeviceCode(userId: string, walletId: string, newDeviceBody: INewDevice): Promise<{
        proceed: boolean;
        message?: undefined;
    } | {
        proceed: boolean;
        message: any;
    }>;
    private validateDeviceAdd;
    getQr(userId: string, deviceId: string): Promise<{
        error: boolean;
        message: string;
    } | {
        message: string;
        error?: undefined;
    }>;
    removeClient(userId: string, deviceId: string): Promise<{
        message: string;
    }>;
    fetchAllDevices: (userId: string) => Promise<any>;
    fetchDevice: (deviceId: string, userId: string) => Promise<any>;
    private fetchDeviceByCondition;
    fetchPrevMessages(deviceId: string): Promise<any>;
    private fetchMessagesByStatus;
    deleteAuth(userId: string, deviceId: string): Promise<{
        message: string;
    }>;
    logoutDevice(userId: string, deviceId: string): Promise<{
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
    updateDevice(phone: string, clientData: any): Promise<{
        error: boolean;
        message: string;
    } | {
        error: boolean;
        message?: undefined;
    }>;
    findDeviceByPhone(phone: string): Promise<IDeviceModel>;
    findDeviceById(userId: string, deviceId: string): Promise<IDeviceModel>;
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
    removeDevice(userId: string, deviceId: string): Promise<void>;
}
declare const _default: DeviceModel;
export default _default;
