import { Document, Model, Schema } from "mongoose";
import { IAdminUser } from "./admin.interface";
export interface IAdminUserModel extends IAdminUser, Document {
    addNewAdmin(): any;
}
export declare const AdminUserSchema: Schema;
export declare const AdminUser: Model<IAdminUserModel>;
