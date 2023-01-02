/// <reference types="mongoose" />
import { EDeviceStatus, IDeviceTokenData, INewDevice } from "../device/device.interface";
import { IApiKey, IDevice } from "./device.interface";
import { IDeviceModel } from "./device.schema";
export declare class DeviceModel {
    newDevice(userId: string, walletId: string, body: IDevice, newDeviceCode: string): Promise<IDeviceModel>;
    private isMaxDeviceLimitReached;
    newDeviceCode(userId: string, walletId: string, newDeviceBody: INewDevice): Promise<{
        proceed: boolean;
        message: any;
    } | {
        proceed: boolean;
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
    fetchAllDevices: (userId: string) => Promise<import("mongoose").LeanDocument<IDeviceModel>[]>;
    fetchDevice: (deviceId: string, userId: string) => Promise<any>;
    private fetchDeviceByCondition;
    fetchDevicesMetrics(): Promise<{
        totalDevices: number;
        activeDevices: number;
        deletedDevices: number;
    }>;
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
    findDeviceByPhone(phone: string): Promise<IDeviceModel>;
    findDeviceByUseId(userId: string): Promise<import("mongoose").LeanDocument<IDeviceModel>[]>;
    findDeviceByIdAndUserId(deviceId: string, userId: string): Promise<any>;
    fetchDeviceMetrics(deviceId: string): Promise<any>;
    retryFailedMessage(userId: string, deviceId: string): Promise<{
        error: boolean;
        message: string;
        messageCount: any;
    }>;
    updateDeviceStatus(deviceId: string, status: EDeviceStatus): Promise<IDeviceModel>;
    removeDevice(userId: string, deviceId: string): Promise<void>;
    getDeviceStatus(userId: string, deviceId: string): Promise<any>;
    addWebHook(userId: string, deviceId: string, url: string): Promise<void>;
    removeWebHook(userId: string, deviceId: string, webHookId: string): Promise<void>;
    fetchDevicesList(): import("mongoose").Query<import("mongoose").LeanDocument<IDeviceModel>[], IDeviceModel, {}, IDeviceModel>;
    private validateWebHook;
}
declare const _default: DeviceModel;
export default _default;
