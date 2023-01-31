import { IMessage, IScheduleMessage } from "./message.interface";
import { Document, Model } from "mongoose";
export interface IMessageModel extends IMessage, Document {
    addMessage(): any;
}
export interface IScheduleMessageModel extends IScheduleMessage, Document {
    addScheduleMessage(): any;
}
export declare const ScheduleMessage: Model<IScheduleMessageModel>;
export declare const MessageQueue: Model<IMessageModel>;
export declare const FastMessage: Model<IMessageModel>;
