export interface ICreateOrder {
    amount: number;
}
export interface IVerifyPayment {
    orderId: string;
    paymentId: string;
    transactionId: string;
    razorpay_signature: string;
}
