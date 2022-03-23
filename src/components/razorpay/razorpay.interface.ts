export interface ICreateOrder{
    amount:number,
    planId:string
}

export interface IVerifyPayment{
    orderId:string,
    paymentId:string,
    transactionId:string,
    razorpay_signature:string
}