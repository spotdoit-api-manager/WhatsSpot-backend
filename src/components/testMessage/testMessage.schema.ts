
import { Document, model, Model, Mongoose, Schema, SchemaTypes } from "mongoose";
import { ITestMessage } from "./testMessage.interface";

export interface ITestMessageModel extends ITestMessage,Document{
    addTestMessage(): any;
  }



const testMessageSchema = new Schema({
    phoneNumber:{
        type:String
    },
    messageCount:{
        type:Number,
        default:0
    }

}, {
    timestamps: true
  });

  testMessageSchema.methods.addTestMessage = async function () {
    return this.save();
};


  export const TestMessage: Model<ITestMessageModel> = model<ITestMessageModel>("TestMessage", testMessageSchema);
