import { IApiBlock } from "./api-blocklist.interface";
import { Document, Model } from "mongoose";
export interface IApiBlockListModel extends IApiBlock, Document {
    addToList(): any;
}
export declare const ApiBlockList: Model<IApiBlockListModel>;
