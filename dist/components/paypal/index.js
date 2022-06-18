"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const paypal_controller_1 = __importDefault(require("./paypal.controller"));
exports.default = [
    {
        path: "/paypal/order/create",
        method: "post",
        escapeAuth: false,
        handler: [paypal_controller_1.default.createOrder]
    },
    {
        path: "/paypal/order/verify",
        method: "post",
        escapeAuth: false,
        handler: [paypal_controller_1.default.verifyOrder]
    },
];
//# sourceMappingURL=index.js.map