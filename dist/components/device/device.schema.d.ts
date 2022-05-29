import { IDevice, IApiKey } from "./device.interface";
import { Document, Model } from "mongoose";
export interface IDeviceModel extends IDevice, Document {
    saveDevice(): any;
}
export interface IApiKeyModal extends IApiKey, Document {
}
export declare const Device: Model<IDeviceModel>;
