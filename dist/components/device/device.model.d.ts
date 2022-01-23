import { EApiKeyStatus, IDevice } from "./device.interface";
export declare class DeviceModel {
    newDevice(body: IDevice, userId: string): Promise<any>;
    getQr(body: any): Promise<{
        error: boolean;
        message: string;
    } | {
        message: string;
        error?: undefined;
    }>;
    fetchAllDevices: (userId: string) => Promise<any>;
    fetchDevice: (deviceId: string, userId: string) => Promise<any>;
    private fetchDeviceByCondition;
    addMessageToQueue(body: any, deviceId: string): Promise<{
        error: boolean;
        message: string;
    }>;
    sendTextMessage(body: any, deviceId: string): Promise<void>;
    private: any;
    sendImageMessage(body: any, deviceId: string): Promise<void>;
    fetchPrevMessages(deviceId: string): Promise<any>;
    private fetchMessagesByStatus;
    deleteAuth(body: any): Promise<{
        message: string;
    }>;
    logoutDevice(body: any): Promise<{
        message: string;
        device: import("./device.shema").IDeviceModel;
    }>;
    generateNewKey(deviceId: string, body: any): Promise<{
        name: any;
        createdOn: Date;
        token: string;
        expiresOn: any;
        status: {
            status: EApiKeyStatus;
            reason: any;
        };
    }>;
    deleteKey(deviceId: string, keyId: string): Promise<void>;
    getKeys(deviceId: string): Promise<any>;
    private addNewTokenDataToDevice;
    private generateDeviceKey;
    signDeviceToken: (deviceId: string, expiresIn: string) => string;
    private getTotalAvailableApiKeys;
    updateDevice(phone: string, clientData: any): Promise<void | {
        error: boolean;
        message: string;
    } | {
        error: boolean;
        message?: undefined;
    }>;
    findDeviceByPhone(phone: string): Promise<import("./device.shema").IDeviceModel>;
    findDeviceById(id: string): Promise<import("./device.shema").IDeviceModel>;
    findDeviceByUseId(userId: string): Promise<any>;
    findDeviceByCondition(condition: any): Promise<any[]>;
    findDeviceByIdAndUserId(deviceId: string, userId: string): Promise<any>;
}
declare const _default: DeviceModel;
export default _default;
