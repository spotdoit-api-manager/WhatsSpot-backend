import { IWallet } from './wallet.interface';
import { Document, Model } from "mongoose";
export interface IWalletModel extends IWallet, Document {
    addNewWallet(): any;
}
export declare const Wallet: Model<IWalletModel>;
