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
exports.PaytmModel = void 0;
const exchange_rate_service_1 = require("./../../lib/services/exchange-rate.service");
const httpErrors_1 = require("./../../lib/utils/httpErrors");
const transaction_interface_1 = require("./../transaction/transaction.interface");
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("../../core/logger"));
/* eslint-disable @typescript-eslint/camelcase */
const plans_interface_1 = require("../plans/plans.interface");
const transaction_model_1 = __importDefault(require("../transaction/transaction.model"));
const plans_model_1 = __importDefault(require("../plans/plans.model"));
const wallet_model_1 = __importDefault(require("../wallet/wallet.model"));
const user_model_1 = __importDefault(require("../user/user.model"));
const pay_with_enum_1 = require("../../core/enums/pay-with.enum");
const logFileName = "PaypalModel";
class PaytmModel {
    createOrder(userId, walletId, planId, amount, currency) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let finalAmount = null;
                let indianAmount = null;
                yield user_model_1.default.checkIfUserCanActivatePlan(userId, planId);
                const plan = yield plans_model_1.default.fetchPlanByPlanId(planId);
                if (planId === plans_interface_1.EPLANS.PAYG) {
                    finalAmount = amount.toString();
                    indianAmount = (yield (0, exchange_rate_service_1.convertCurrency)(currency, "INR", amount));
                }
                else {
                    finalAmount = (yield (0, exchange_rate_service_1.convertCurrency)("INR", currency, plan.planAmount)).toString();
                    indianAmount = plan.planAmount;
                }
                const transactionMessage = planId == plans_interface_1.EPLANS.PAYG ? "Adding money to wallet" : `Buying ${plan.planName} subscription`;
                const payload = {
                    intent: "CAPTURE",
                    payment_data: {
                        planId,
                        userId,
                        walletId
                    },
                    purchase_units: [{
                            description: transactionMessage,
                            userId: userId,
                            amount: {
                                currency_code: currency,
                                value: finalAmount,
                                breakdown: {
                                    item_total: {
                                        currency_code: currency,
                                        value: finalAmount
                                    }
                                }
                            },
                            items: [{
                                    name: "Enterprise Subscription",
                                    quantity: "1",
                                    category: "DIGITAL_GOODS",
                                    unit_amount: {
                                        currency_code: currency,
                                        value: finalAmount,
                                    },
                                }]
                        }]
                };
                const order = yield this.createPaypalOrder(payload);
                const transaction = yield transaction_model_1.default.createTransactionForPlan(plan.planId, order.id, userId, walletId, transaction_interface_1.ETransactionTypes.CREDIT, indianAmount, transactionMessage, pay_with_enum_1.EPayWith.PAYPAL);
                return transaction;
            }
            catch (e) {
                return { error: true, message: e.message };
            }
        });
    }
    ;
    createPaypalOrder(order) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield this.getPaypalToken();
            const url = `${process.env.PAYPAL_API_URL}/v2/checkout/orders`;
            const options = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            };
            const res = yield axios_1.default.post(url, order, options);
            return res.data;
        });
    }
    getPaypalToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${process.env.PAYPAL_API_URL}/v1/oauth2/token`;
            const options = {
                auth: {
                    username: process.env.PAYPAL_CLIENT_ID,
                    password: process.env.PAYPAL_CLIENT_SECRET
                }
            };
            const res = yield axios_1.default.post(url, new URLSearchParams({ grant_type: "client_credentials" }), options);
            return res.data.access_token;
        });
    }
    getOrderDetails(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = `${process.env.PAYPAL_API_URL}/v2/checkout/orders/${orderId}`;
                const token = yield this.getPaypalToken();
                const options = {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                };
                const res = yield axios_1.default.get(url, options);
                return res.data;
            }
            catch (e) {
                logger_1.default.error(logFileName, e);
                throw new httpErrors_1.HTTP400Error(e.message);
            }
        });
    }
    verifyOrder(userId, walletId, orderId, transactionId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield this.getOrderDetails(orderId);
            const transaction = yield transaction_model_1.default.fetchTransactionById(walletId, transactionId);
            if (!order)
                throw new httpErrors_1.HTTP400Error("ORDER_NOT_FOUND");
            if (!transaction)
                throw new httpErrors_1.HTTP400Error("UNKNOWN_ORDER");
            if (order.status !== "COMPLETED")
                throw new httpErrors_1.HTTP400Error("ORDER_NOT_COMPLETED");
            if (transaction.orderId !== orderId)
                throw new httpErrors_1.HTTP400Error("ORDER_NOT_MATCHED");
            if ((transaction === null || transaction === void 0 ? void 0 : transaction.metaData) && ((_a = transaction === null || transaction === void 0 ? void 0 : transaction.metaData) === null || _a === void 0 ? void 0 : _a.planId) != plans_interface_1.EPLANS.PAYG) {
                yield plans_model_1.default.activatePlan(userId, transaction.metaData.planId, transaction._id);
            }
            else {
                yield wallet_model_1.default.addCreditToWallet(walletId, transaction.amount);
            }
            const updatedTransaction = yield transaction_model_1.default.updateTransactionStatus(transactionId, transaction_interface_1.ETransactionStatus.SUCCESS);
            return updatedTransaction;
        });
    }
}
exports.PaytmModel = PaytmModel;
exports.default = new PaytmModel();
//# sourceMappingURL=paypal.model.js.map