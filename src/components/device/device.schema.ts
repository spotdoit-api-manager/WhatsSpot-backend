
import { IDevice, EApiKeyStatus, IApiKey } from "./device.interface";
import { Document, Model, model, Schema, Types } from "mongoose";
import { validateMobile } from "../../lib/utils";

export interface IDeviceModel extends IDevice, Document {
  saveDevice(): any;
}
export interface IApiKeyModal extends IApiKey, Document {
}


const deviceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    isDeleted:{
      status:{
        type:Boolean,
        default: false
      },
      deletedAt:{
        type:Date,
        required: false
      }
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    phone: {
      type: "string",
      required: true,
      validate: [validateMobile, "invalid phone number"],
    },
    country:{
      type:String,
      required: true,
    },
    apiKeys: [{
      token: String,
      expiresOn: Date,
      createdOn: Date,
      name: String,
      status: {
        status: {
          type: String,
          enum: ["ACTIVE", "INACTIVE","EXPIRED"]
        },
        reason: String
      }
    }],
    deviceStatus:{
      type:String,
      enum:["SENDING","IDLE"]
    },
    authState: Boolean,
    reason: {
      statusCode: Number,
      message: String,
      error: String
    }
  },
  {
    timestamps: true,
  }
);

deviceSchema.methods.saveDevice = async function () {
  return this.save();
};

export const Device: Model<IDeviceModel> = model<IDeviceModel>("Device", deviceSchema);