export declare class DeviceUtils {
    findDeviceById(userId: string, deviceId: string): Promise<import("./device.schema").IDeviceModel>;
    findDeviceByCondition(condition: any): Promise<any[]>;
    updateDevice(deviceId: string, clientData: any): Promise<{
        error: boolean;
        message: string;
    } | {
        error: boolean;
        message?: undefined;
    }>;
    updateDeviceLastUsed(deviceId: string): Promise<void>;
}
declare const _default: DeviceUtils;
export default _default;
