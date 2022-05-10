"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const razorpay_controller_1 = __importDefault(require("./razorpay.controller"));
exports.default = [
    {
        path: "/razorpay/createOrder",
        method: "post",
        handler: [razorpay_controller_1.default.createNewOrder]
    },
    {
        path: "/razorpay/verifyPayment",
        method: "post",
        handler: [razorpay_controller_1.default.verifyPayment]
    }
];
//# sourceMappingURL=index.js.map