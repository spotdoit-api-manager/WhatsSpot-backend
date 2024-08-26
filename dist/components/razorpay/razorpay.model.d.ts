import { IVerifyPayment } from "./razorpay.interface";
import { EPLANS } from "../plans/plans.interface";
export declare class RazorPayModel {
    createOrder(userId: string, walletId: string, planId: EPLANS, amount: number): Promise<{
        order: any;
    }>;
    verifyPayment(userId: string, walletId: string, body: IVerifyPayment): Promise<{
        signatureIsValid: boolean;
    }>;
}
declare const _default: RazorPayModel;
export default _default;
