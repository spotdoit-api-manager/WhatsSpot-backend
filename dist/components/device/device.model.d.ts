import { IDevice } from "./device.interface";
export declare class DeviceModel {
    newDevice(body: IDevice): Promise<any>;
    getQr(body: any): Promise<{
        message: string;
    }>;
    findDeviceByPhone(phone: string): Promise<import("./device.shema").IDeviceModel>;
}
declare const _default: DeviceModel;
export default _default;
