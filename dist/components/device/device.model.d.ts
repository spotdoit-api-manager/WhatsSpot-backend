import { IDevice } from "./device.interface";
export declare class DeviceModel {
    newDevice(body: IDevice, userId: string): Promise<any>;
    getQr(body: any): Promise<{
        message: string;
    }>;
    fetchAllDevices: (userId: string) => Promise<any>;
    fetchDevice: (deviceId: string, userId: string) => Promise<void>;
    addMessageToQueue(body: any, deviceId: string): Promise<{
        message: string;
    }>;
    sendTextMessage(body: any, deviceId: string): Promise<void>;
    sendImageMessage(body: any, deviceId: string): Promise<void>;
    deleteAuth(body: any): Promise<{
        message: string;
    }>;
    logoutDevice(body: any): Promise<{
        message: string;
        device: import("./device.shema").IDeviceModel;
    }>;
    generateNewKey(deviceId: string, body: any): Promise<{
        token: string;
        expiresOn: any;
    }>;
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
