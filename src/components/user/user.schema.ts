/* eslint-disable @typescript-eslint/interface-name-prefix */
import { EPLANS } from "./../plans/plans.interface";
import { Document,Model, model, Schema, SchemaType, SchemaTypes } from "mongoose";
import { NextFunction } from "express";
import { IUser } from "./user.interface";
import * as bcrypt from "bcryptjs";

export interface IUserModel extends IUser,Document{
  addNewUser(): any;
  correctPassword(pass1: string, pass2: string): boolean;
  sendOtpToMobile(): any;
}
const planRef: Schema = new Schema({
  planName:{
    type:String,
    required:true
  },
    planRef:{
      type:SchemaTypes.ObjectId,
      ref:"UserPlan",
      required:true
    }
},{timestamps:true});

const UserSettingsSchema = new Schema({
  notifications:{
    device:{
     email:{
       type:Boolean,
       default:true
     },
     whatsapp:{
      type:Boolean,
      default:true
     },
      sms:{
        type:Boolean,
        default:true
      }
    },
    plan:{
      email:{
        type:Boolean,
        default:true
      },
      whatsapp:{
       type:Boolean,
       default:true
      },
       sms:{
         type:Boolean,
         default:true
       }

    }
  }
},{timestamps:false});

export const UserSchema: Schema = new Schema(
  {
   
    userName: {
      type: String,
      required: true
    },
    password: {
      type: String,
      select: false,
      unique: true,
      sparse:true
    },
    email : {
      type:String,
      unique:true,
      required:true
    },
    activePlans:[planRef],
    previousPlans:[planRef],
    walletId:{
      required:true,
      type:SchemaTypes.ObjectId,
      ref:"wallet",
      immutable: true 
    },
    dateOfBirth: Date,
    role: {
      type: String,
      enum: ["user", "admin"],
      required: true,
      description:"user"
    },
    
    phone: {
      type: String,
      minlength: 3,
      unique: true,
      required:true
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    otp: Number,
    deviceCodes:{
      type:SchemaTypes.Mixed,
      required:false,
    },
    isVerified: {
      type: Boolean,
      default:false
    },
    deactivation: {
      type: Boolean,
      default: false
    },
    tokens: [String],
    hints: {
      type: Number,
      default:0
    },
    avatar:{
      type:String
    },
    country:{
      type:String,
      required:true
    },
    settings:UserSettingsSchema
  },
  {
    timestamps: true
  }
);

UserSchema.methods.addNewUser = async function () {
     return this.save();
};


UserSchema.methods.correctPassword = async function (candidatePassword: string, userPassword: string) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

export const User: Model<IUserModel> = model<IUserModel>("User", UserSchema);