import { Document, Model, Schema } from "mongoose";
import { IUser } from "./user.interface";
export interface IUserModel extends IUser, Document {
    addNewUser(): any;
    correctPassword(pass1: string, pass2: string): boolean;
    sendOtpToMobile(): any;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const UserSchema: Schema;
export declare const User: Model<IUserModel>;
