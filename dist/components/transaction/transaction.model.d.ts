import { EPayWith } from "./../../core/enums/pay-with.enum";
import { ITransactionModel } from "./transaction.schema";
import { ETransactionStatus, ETransactionTypes } from "./transaction.interface";
export declare class TransactionModel {
    fetchTransactionById(walletId: string, transactionId: string): Promise<ITransactionModel>;
    fetchTransactionByMethod(method: EPayWith, status: ETransactionStatus | null, page?: number): Promise<any[]>;
    fetchTransactions(walletId: string, page: number): Promise<{
        data: any;
        pagination: {
            currentPage: number;
            total: number;
            limit: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    createTransactionForPlan(planId: string, orderId: string, userId: string, walletId: string, type: ETransactionTypes, amount: number, description: string, method: EPayWith): Promise<ITransactionModel>;
    createTransactionForWallet(walletId: string, userId: string, type: ETransactionTypes, amount: number, description: string, metaData: Record<string, any>, method: EPayWith): Promise<ITransactionModel>;
    updateTransactionStatus(transactionId: string, status: ETransactionStatus): Promise<ITransactionModel>;
    fetchTransactionByOrderId(orderId: string): Promise<ITransactionModel>;
}
declare const _default: TransactionModel;
export default _default;
