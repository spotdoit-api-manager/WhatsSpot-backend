import paypalController from "./paypal.controller";

export default [
{
    path: "/paypal/order/create",
    method: "post",
    escapeAuth:false,
    handler: [paypalController.createOrder]
},
{
    path: "/paypal/order/verify",
    method: "post",
    escapeAuth:false,
    handler: [paypalController.verifyOrder]
},
];