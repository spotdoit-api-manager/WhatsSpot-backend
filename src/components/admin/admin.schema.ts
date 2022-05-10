/* eslint-disable @typescript-eslint/interface-name-prefix */
import { Document,Model, model, Schema } from "mongoose";
import { IAdminUser } from "./admin.interface";

export interface IAdminUserModel extends IAdminUser,Document{
  addNewAdmin(): any;
 
}
export const AdminUserSchema: Schema = new Schema(
  {
   name:{
     type:String,
      required:true
   },
   phoneNumber:{
      type:String,
      required:true
   },
   otp:{
     type:String,
     required:false
   },
    email:{
      type:String,
      required:true
    },
    isSuperAdmin:{
      type:Boolean,
      required:true,
      default:false
    },
    allowed:{
      type:Boolean,
      required:true,
      default:false
    },
    role:{
      type:String,
      required:true,
      default:"admin"
    }
  },
  {
    timestamps: true
  }
);

AdminUserSchema.methods.addNewAdmin = async function () {
     return this.save();
};



export const AdminUser: Model<IAdminUserModel> = model<IAdminUserModel>("AdminUser", AdminUserSchema);