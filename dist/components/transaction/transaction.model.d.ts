import { ITransactionModel } from './transaction.schema';
import { ETransactionStatus, ETransactionTypes } from "./transaction.interface";
export declare class TransactionModel {
    fetchTransactions(walletId: any): Promise<any[]>;
    createTransaction(orderId: string, userId: string, walletId: string, type: ETransactionTypes, amount: number, description: string): Promise<ITransactionModel>;
    updateTransactionStatus(transactionId: string, status: ETransactionStatus): Promise<ITransactionModel>;
}
declare const _default: TransactionModel;
export default _default;
