import { IMessage } from "./message.interface";
import { Document, Model } from "mongoose";
export interface IMessageModel extends IMessage, Document {
    addMessage(): any;
}
export declare const MessageQueue: Model<IMessageModel>;
export declare const FastMessage: Model<IMessageModel>;
