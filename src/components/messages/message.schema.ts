import { EWhatsappMessageTypes } from "./../../lib/services/whatsapp/whatsapp.enum";

import { ESendType, IMessage, IScheduleMessage } from "./message.interface";
import { Document, Model, model, Schema, SchemaType, SchemaTypes } from "mongoose";
import { validateMobile } from "../../lib/utils";

export interface IMessageModel extends IMessage, Document {
  addMessage(): any;
}

export interface IScheduleMessageModel extends IScheduleMessage, Document {
  addScheduleMessage(): any;
}

const contactSentSchema = new Schema({
  phoneNumber:{
    type:String,
    required:true
  },
  name:{
    type:String,
    required:false
  },
  status:{
    type:String,
    enum:["SENT","ERROR","PENDING"]
  },
  reason:{
    type:String,
  }
},{timestamps: true});

const whatsappTextMessageSchema = new Schema({
  text:{
    type:String,
    required:true
  }
});

const whatsappListMessageSchema = new Schema({
  title: {
    type:String,
    required:true,
  },
  text: {
    type:String,
    required:true,
  },
  footer: {
    type:String,
    required:true,
  },
  buttonText: {
    type:String,
    required:true,
  },
  sections: [
   { title: {
    type:String,
    required:true,
  },
    rows: [{
      title: {
        type:String,
        required:true,
      },
      rowId: {
        type:String,
        required:true,
      },
      description: {
        type:String,
        required:false,
      },
    }]
  }
  ]
});



const messageSchema = new Schema(
  {
    priority:{
      type:Number,
      required:true,
      default:0
    },
    to: {
      type: String,
      required: true,
    },
    messageType:{
      type:String,
      enum:Object.values(EWhatsappMessageTypes),
    },
    message:{
      type:Schema.Types.Mixed,
    },
    sendType: {
      type: String,
      enum: Object.values(ESendType),
    },
    phone: String,
    status: {
      type:String,
      enum:["SENT","ERROR","PENDING"]
    },
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
    },
    isGroup:{
      type:Boolean,
      default: false
    },
   
    contactsSent:[contactSentSchema],
    scheduleTime: {
      type: Date,
      required: false
    }
  },
  {
    timestamps: true,
  }
);

messageSchema.methods.addMessage = async function () {
  return this.save();
};

export const ScheduleMessage: Model<IScheduleMessageModel> = model<IScheduleMessageModel>("ScheduleMessage", messageSchema);
export const MessageQueue: Model<IMessageModel> = model<IMessageModel>("MessageQueue", messageSchema);
export const FastMessage: Model<IMessageModel> = model<IMessageModel>("FastMessage", messageSchema);