import { EPayWithMongoEnum } from "./../../core/enums/pay-with.enum";

import { ITransaction } from "./transaction.interface";
import { Document, model, Model, Mongoose, Schema, SchemaTypes } from "mongoose";

export interface ITransactionModel extends ITransaction,Document{
    addTransaction(): any;
  }



const TransactionSchema = new Schema({
    userId:{
        type:SchemaTypes.ObjectId,
        ref:"user",
        required:true
    },
    walletId:{
        type:SchemaTypes.ObjectId,
        ref:"wallet",
        required:true
    },
    orderId:{
        type:String,
        required:true
    },
  metaData:{
      type:Map,
      of:String
  },
    amount:{
        type:Number,
        required:true,
        mutable:false
    },
    status:{
        type:String,
        enum:["ERROR","PENDING","SUCCESS"],
        required:true
    },
    type:{
        type:String,
        enum:["CREDIT","DEBIT"],
        required:true
    },
  
    description:{
        type:String
    },
    method:{
        type:String,
        enum:EPayWithMongoEnum
    }

}, {
    timestamps: true
  });

  TransactionSchema.methods.addTransaction = async function () {
    return this.save();
};

  export const Transaction: Model<ITransactionModel> = model<ITransactionModel>("transaction", TransactionSchema);
