"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const qr_pay_controller_1 = __importDefault(require("./qr-pay.controller"));
exports.default = [
    {
        path: "/qrPay/order/create",
        method: "post",
        escapeAuth: false,
        handler: [qr_pay_controller_1.default.createNewOrder]
    },
];
//# sourceMappingURL=index.js.map