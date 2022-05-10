import { Document, Model } from "mongoose";
import { ITestMessage } from "./testMessage.interface";
export interface ITestMessageModel extends ITestMessage, Document {
    addTestMessage(): any;
}
export declare const TestMessage: Model<ITestMessageModel>;
