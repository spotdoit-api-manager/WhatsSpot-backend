import { IDevice } from "./device.interface";
import { Document, Model } from "mongoose";
export interface IDeviceModel extends IDevice, Document {
    saveDevice(): any;
}
export declare const Device: Model<IDeviceModel>;
