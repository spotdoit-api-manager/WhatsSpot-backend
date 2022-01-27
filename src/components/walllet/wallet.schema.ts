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



export const Wallet: Model<IWalletModel> = model<IWalletModel>("wallet", WalletSchema);