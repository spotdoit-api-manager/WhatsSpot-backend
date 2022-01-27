import razorpayController from "./razorpay.controller";

export default [
    {
        path:"/razorpay/createOrder",
        method:"post",
        handler:[razorpayController.createNewOrder]
    },
    {
        path:"/razorpay/verifyPayment",
        method:"post",
        handler:[razorpayController.verifyPayment]
    }
]