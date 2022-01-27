import { IWallet } from './wallet.interface';
import { Document, model, Model, Mongoose, Schema, SchemaTypes } from "mongoose";

export interface IWalletModel extends IWallet,Document{
    addNewWallet(): any;
  }

  
const WalletSchema = new Schema({
    userId:{
        type:SchemaTypes.ObjectId,
        ref:"user",
    },
    balance:{
        type:Number,
        default:0
    }
}, {
    timestamps: true
  });

  
WalletSchema.methods.addNewAllet = async function () {
    return this.save();
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
    amount:{
        type:Number,
        required:true
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
    }

}, {
    timestamps: true
  });



export const Wallet: Model<IWalletModel> = model<IWalletModel>("wallet", WalletSchema);
