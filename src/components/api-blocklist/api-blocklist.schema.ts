import { IApiBlock } from "./api-blocklist.interface";

import { Document, Model, model, Schema, Types } from "mongoose";

export interface IApiBlockListModel extends IApiBlock, Document {
  addToList(): any;
}


const apiBlockListSchema = new Schema({
    token: {
        type:String,
        required: true
    },
    deviceId:{
        type:Schema.Types.ObjectId,
        ref:"Device"
    },
    createdOn:{
        type:Date,
        required:true,

    },
    expiresOn:{
        type:Date,
        required:true,
    },
    blockedOn:{
        type:Date,
        required: true,
        default:new Date()
    }

},{timestamps: true});


apiBlockListSchema.methods.addToList = async function () {
    return this.save();
  };
export const ApiBlockList: Model<IApiBlockListModel> = model<IApiBlockListModel>("api-block-list", apiBlockListSchema);