/// <reference types="mongoose" />
import { EPayWith } from "./../../core/enums/pay-with.enum";
import { ITransactionModel } from "./transaction.schema";
import { ETransactionStatus, ETransactionTypes } from "./transaction.interface";
export declare class TransactionModel {
    fetchTransactionById(walletId: string, transactionId: string): import("mongoose").Query<any>;
    fetchTransactionByMethod(method: EPayWith, status: ETransactionStatus | null, page?: number): Promise<any[]>;
    fetchTransactions(walletId: string, page: number): Promise<any[]>;
    createTransactionForPlan(planId: string, orderId: string, userId: string, walletId: string, type: ETransactionTypes, amount: number, description: string, method: EPayWith): Promise<ITransactionModel>;
    createTransactionForWallet(walletId: string, userId: string, type: ETransactionTypes, amount: number, description: string, metaData: Record<string, any>, method: EPayWith): Promise<ITransactionModel>;
    updateTransactionStatus(transactionId: string, status: ETransactionStatus): Promise<any>;
    fetchTransactionByOrderId(orderId: string): import("mongoose").Query<any>;
}
declare const _default: TransactionModel;
export default _default;
