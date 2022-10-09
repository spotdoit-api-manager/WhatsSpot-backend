import { ITransactionModel } from "./../transaction/transaction.schema";
import { EPLANS } from "../plans/plans.interface";
export declare class PaytmModel {
    createOrder(userId: string, walletId: string, planId: EPLANS, amount: number, currency: string): Promise<ITransactionModel | {
        error: boolean;
        message: any;
    }>;
    createPaypalOrder(order: any): Promise<any>;
    private getPaypalToken;
    private getOrderDetails;
    verifyOrder(userId: string, walletId: string, orderId: string, transactionId: string): Promise<ITransactionModel>;
}
declare const _default: PaytmModel;
export default _default;
