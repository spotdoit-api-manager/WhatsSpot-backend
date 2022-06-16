import qrPayController from "./qr-pay.controller";

export default [
    {
        path:"/qrPay/order/create",
        method:"post",
        handler:[qrPayController.createNewOrder]
    },
    
];