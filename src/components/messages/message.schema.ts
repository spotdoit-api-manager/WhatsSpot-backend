import { IMessage } from './message.interface';
import { Document,Model, model, Schema } from "mongoose";
import { validateMobile } from "../../lib/utils";

export interface IMessageModel extends IMessage,Document{
    addMessage(): any;
  }
  

const messageSchema = new Schema(
  {
    to: {
      type: "string",
      required: true,
    },
    message:String,
    phone:String,
   status:String
  },
  {
    timestamps: true,
  }
);

messageSchema.methods.addMessage = async function () {
    return this.save();
}

export const Message: Model<IMessageModel> = model<IMessageModel>("MessageQueue", messageSchema);