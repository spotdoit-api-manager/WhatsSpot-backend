import qrPayController from "./qr-pay.controller";

export default [
    {
        path:"/qrPay/order/create",
        method:"post",
        escapeAuth:false,
        handler:[qrPayController.createNewOrder]
    },
    
];