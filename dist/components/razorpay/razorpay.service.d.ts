import { ICreateOrder } from './razorpay.interface';
export declare class RazorPayService {
    private readonly razorPyaInstance;
    createOrder: (userId: string, createOrder: ICreateOrder) => Promise<unknown>;
}
declare const _default: RazorPayService;
export default _default;
