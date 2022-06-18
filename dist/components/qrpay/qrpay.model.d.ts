import { ITransactionModel } from "../transaction/transaction.schema";
import { EPLANS } from "../plans/plans.interface";
export declare class QrPayModel {
    createOrder(userId: string, walletId: string, planId: EPLANS, amount: number): Promise<ITransactionModel>;
}
declare const _default: QrPayModel;
export default _default;
