import { IClient } from './client.interfacce';
import { Document, Model } from "mongoose";
export interface IClientModel extends IClient, Document {
    saveDevice(): any;
}
export declare const Client: Model<IClientModel>;
