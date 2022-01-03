import { IDevice } from "./device.interface";
export declare class DeviceModel {
    newDevice(body: IDevice): Promise<any>;
    getQr(body: any): Promise<{
        message: string;
    }>;
    deleteAuth(body: any): Promise<{
        message: string;
    }>;
    updateDevice(phone: string, clientData: any): Promise<void | {
        error: boolean;
        message: string;
    } | {
        error: boolean;
        message?: undefined;
    }>;
    findDeviceByPhone(phone: string): Promise<import("./device.shema").IDeviceModel>;
    findDeviceById(id: string): Promise<import("./device.shema").IDeviceModel>;
    findDeviceByCondition(condition: any): Promise<any[]>;
}
declare const _default: DeviceModel;
export default _default;
