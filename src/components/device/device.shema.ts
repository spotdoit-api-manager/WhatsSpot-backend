import { IDevice } from './device.interface';
import { Document,Model, model, Schema } from "mongoose";
import { validateMobile } from "../../lib/utils";

export interface IDeviceModel extends IDevice,Document{
    saveDevice(): any;
  }
  

const deviceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: "string",
      required: true,
      validate: [validateMobile, "invalid phone number"],
    },
  },
  {
    timestamps: true,
  }
);

deviceSchema.methods.saveDevice = async function () {
    return this.save();
}

export const Device: Model<IDeviceModel> = model<IDeviceModel>("Device", deviceSchema);