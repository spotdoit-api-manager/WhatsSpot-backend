"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RazorPayService = void 0;
/* eslint-disable @typescript-eslint/camelcase */
const index_1 = require("./../../config/index");
const razorpay_1 = __importDefault(require("razorpay"));
class RazorPayService {
    constructor() {
        this.razorPyaInstance = new razorpay_1.default({ key_id: index_1.razorPaySecrets.key, key_secret: index_1.razorPaySecrets.secret });
        this.createOrder = (userId, createOrder) => {
            return new Promise((resolve) => {
                try {
                    console.log("creating order with ", createOrder, userId, index_1.razorPaySecrets.key, index_1.razorPaySecrets.secret);
                    const options = {
                        amount: createOrder.amount * 100,
                        currency: "INR",
                        receipt: `receipt_${userId}`,
                        notes: {
                            planId: createOrder.planId,
                        }
                    };
                    this.razorPyaInstance.orders.create(options, function (err, order) {
                        var _a;
                        if (err) {
                            console.log(err);
                            resolve({ error: true, message: (_a = err === null || err === void 0 ? void 0 : err.error) === null || _a === void 0 ? void 0 : _a.description });
                        }
                        console.log(order);
                        resolve({ error: false, order });
                    });
                    console.log("created ");
                }
                catch (err) {
                    console.log(err);
                    resolve({ error: true, message: err.message });
                }
            });
        };
    }
}
exports.RazorPayService = RazorPayService;
exports.default = new RazorPayService();
//# sourceMappingURL=razorpay.service.js.map