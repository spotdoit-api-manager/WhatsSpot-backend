import { ITransaction } from "./transaction.interface";
import { Document, Model } from "mongoose";
export interface ITransactionModel extends ITransaction, Document {
    addTransaction(): any;
}
export declare const Transaction: Model<ITransactionModel>;
