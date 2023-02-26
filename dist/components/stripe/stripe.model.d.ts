import { IStripePrice, IStripeProduct } from "./stripe.interface";
export declare class StripePaymentModel {
    addProduct(productBody: IStripeProduct): Promise<any>;
    getProducts(userId: string, limit?: number): Promise<any>;
    createPrice(userId: string, priceBody: IStripePrice): Promise<void>;
    getPrices(userId: string, limit?: number): Promise<any>;
    createNewSession(userId: string, walletId: string, amount: number, planId: string): Promise<{
        sessionId: any;
        sessionUrl: any;
        amount: any;
        expiresAt: any;
    }>;
    validateSession(userId: string, walletId: string, sessionId: string): Promise<void>;
    fetchSession(userId: string, sessionId: string): Promise<any>;
    expireSession(userId: string, sessionId: string): Promise<any>;
    stripeEvent(event: any): void | Promise<void>;
    private sessionSucceed;
    private sessionFailed;
    private sessionCancelled;
    private sessionExpired;
    validateSignature(body: any, sig: any, secret: string): any;
}
declare const _default: StripePaymentModel;
export default _default;
