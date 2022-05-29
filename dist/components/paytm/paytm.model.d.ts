import { EPLANS } from "../plans/plans.interface";
declare class PaytmModel {
    private updateTransactionInformation;
    private checkTransactionStatus;
    responseFromPaytm(body: any): Promise<string>;
    initiatePaytmTransaction(userId: string, walletId: string, planId: EPLANS, amount: number): Promise<string>;
    private payWithPaytm;
    private initPayment;
    private responsePayment;
}
declare const _default: PaytmModel;
export default _default;
