import { IMessage } from './message.interface';
import { Document, Model, model, Schema, SchemaType, SchemaTypes } from "mongoose";
import { validateMobile } from "../../lib/utils";

export interface IMessageModel extends IMessage, Document {
  addMessage(): any;
}


const messageSchema = new Schema(
  {
    to: {
      type: String,
      required: true,
    },
    message: String,
    sendType: {
      type: String,
      enum: ["FAST", "QUEUE"]
    },
    phone: String,
    status: String,
    reason: {
      type: String,
      required: false
    },
    deviceId:{
      type:SchemaTypes.ObjectId,
      ref:"device"
    },
    userId:{
      type:SchemaTypes.ObjectId,
      ref:"user"
    },
    expand: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

messageSchema.methods.addMessage = async function () {
  return this.save();
}

export const MessageQueue: Model<IMessageModel> = model<IMessageModel>("MessageQueue", messageSchema);
export const FastMessage: Model<IMessageModel> = model<IMessageModel>("FastMessage", messageSchema);