import { ICreateOrder, IVerifyPayment } from './razorpay.interface';
export declare class RazorPayModel {
    createOrder(userId: string, walletId: string, body: ICreateOrder): Promise<{
        order: any;
    }>;
    verifyPayment(userId: string, walletId: string, body: IVerifyPayment): Promise<{
        signatureIsValid: boolean;
    }>;
}
declare const _default: RazorPayModel;
export default _default;
