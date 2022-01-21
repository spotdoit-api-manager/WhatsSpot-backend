import { IDevice } from './device.interface';
import { Document, Model, model, Schema, Types } from "mongoose";
import { validateMobile } from "../../lib/utils";

export interface IDeviceModel extends IDevice, Document {
  saveDevice(): any;
}


const deviceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
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
    apiKeys: {
      token: String,
      expiresOn: String
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
}

export const Device: Model<IDeviceModel> = model<IDeviceModel>("Device", deviceSchema);