"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RazorPayService = void 0;
const transaction_interface_1 = require("./../transaction/transaction.interface");
/* eslint-disable @typescript-eslint/camelcase */
const index_1 = require("./../../config/index");
const razorpay_interface_1 = require("./razorpay.interface");
const razorpay_1 = __importDefault(require("razorpay"));
const transaction_model_1 = __importDefault(require("../transaction/transaction.model"));
const logger_1 = __importDefault(require("../../core/logger"));
const CHK_TRX_STATUS_IN = 1; //In Minutes
const logFileName = "[RazorPayService]";
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
                    this.razorPyaInstance.orders.create(options, (err, order) => {
                        var _a;
                        if (err) {
                            console.log(err);
                            resolve({ error: true, message: (_a = err === null || err === void 0 ? void 0 : err.error) === null || _a === void 0 ? void 0 : _a.description });
                        }
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
    checkTransactionStatusIn(orderId, transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                try {
                    const razorPyaInstance = new razorpay_1.default({ key_id: index_1.razorPaySecrets.key, key_secret: index_1.razorPaySecrets.secret });
                    logger_1.default.info(logFileName, "Checking transaction status: ", transactionId);
                    const order = yield razorPyaInstance.orders.fetch(orderId);
                    if (order && order.status == razorpay_interface_1.ERazorPayOrderStatus.CREATED) {
                        logger_1.default.info(logFileName, "Transaction is still in created state,marking it as cancelled ");
                        transaction_model_1.default.updateTransactionStatus(transactionId, transaction_interface_1.ETransactionStatus.CANCELLED);
                    }
                    else if (order && order.status == razorpay_interface_1.ERazorPayOrderStatus.ATTEMPTED) {
                        logger_1.default.info(logFileName, "Transaction is in attempted state,marking it as error ");
                        transaction_model_1.default.updateTransactionStatus(transactionId, transaction_interface_1.ETransactionStatus.ERROR);
                    }
                    else if (order && order.status == razorpay_interface_1.ERazorPayOrderStatus.PAID) {
                        logger_1.default.info(logFileName, "Transaction is in paid state,marking it as success ");
                        //!TODO:can Add logic to check if user  activate plan is really activated 
                        transaction_model_1.default.updateTransactionStatus(transactionId, transaction_interface_1.ETransactionStatus.SUCCESS);
                    }
                }
                catch (err) {
                    logger_1.default.error(logFileName, `Error while checking transaction status: ${transactionId}`, err.message);
                }
            }), CHK_TRX_STATUS_IN * 60 * 1000);
        });
    }
}
exports.RazorPayService = RazorPayService;
exports.default = new RazorPayService();
//# sourceMappingURL=razorpay.service.js.map