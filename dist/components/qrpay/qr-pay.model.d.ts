import { ITransactionModel } from "../transaction/transaction.schema";
import { EPLANS } from "../plans/plans.interface";
export declare class QrPayModel {
    createOrder(userId: string, walletId: string, transactionId: string, planId: EPLANS, amount: number): Promise<ITransactionModel>;
    approvePayment(userId: string, paymentId: string): Promise<ITransactionModel>;
    rejectPayment(userId: string, paymentId: string, reason: string): Promise<ITransactionModel>;
}
declare const _default: QrPayModel;
export default _default;
