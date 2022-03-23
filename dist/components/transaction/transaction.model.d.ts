/// <reference types="mongoose" />
import { ITransactionModel } from './transaction.schema';
import { ETransactionStatus, ETransactionTypes } from "./transaction.interface";
export declare class TransactionModel {
    fetchTransactionById(walletId: any, transactionId: any): import("mongoose").DocumentQuery<ITransactionModel, ITransactionModel, {}>;
    fetchTransactions(walletId: string): Promise<any[]>;
    createTransactionForRazorPay(planId: string, orderId: string, userId: string, walletId: string, type: ETransactionTypes, amount: number, description: string): Promise<ITransactionModel>;
    createTransactionForWallet(walletId: string, userId: string, type: ETransactionTypes, amount: number, description: string, metaData?: Object): Promise<ITransactionModel>;
    updateTransactionStatus(transactionId: string, status: ETransactionStatus): Promise<ITransactionModel>;
}
declare const _default: TransactionModel;
export default _default;
