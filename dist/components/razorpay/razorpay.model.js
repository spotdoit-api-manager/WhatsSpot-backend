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
exports.RazorPayModel = void 0;
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const pay_with_enum_1 = require("./../../core/enums/pay-with.enum");
const transaction_interface_1 = require("../transaction/transaction.interface");
const transaction_model_1 = __importDefault(require("../transaction/transaction.model"));
const index_1 = require("./../../config/index");
const httpErrors_1 = require("./../../lib/utils/httpErrors");
const razorpay_service_1 = __importDefault(require("./razorpay.service"));
const wallet_model_1 = __importDefault(require("../wallet/wallet.model"));
const crypto_1 = __importDefault(require("crypto"));
const plans_interface_1 = require("../plans/plans.interface");
const plans_model_1 = __importDefault(require("../plans/plans.model"));
const logger_1 = __importDefault(require("../../core/logger"));
const user_model_1 = __importDefault(require("../user/user.model"));
const logFileName = "[RazorPayModel]";
class RazorPayModel {
    createOrder(userId, walletId, planId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info(logFileName, planId, amount);
                const plan = yield plans_model_1.default.fetchPlanByPlanId(planId);
                yield user_model_1.default.checkIfUserCanActivatePlan(userId, planId);
                if (!plan)
                    throw new httpErrors_1.HTTP401Error("INVALID_PLAN");
                const order = yield razorpay_service_1.default.createOrder(userId, { planId, amount });
                if (!order)
                    throw new httpErrors_1.HTTP401Error("UNKNOWN_ERROR");
                if (order.error)
                    throw new httpErrors_1.HTTP401Error(order.message);
                const transactionMessage = plan.planId == "PAYG" ? "Adding money to wallet" : `Buying plan -> ${plan.planName}`;
                const transaction = yield transaction_model_1.default.createTransactionForPlan(plan.planId, order.order.id, userId, walletId, transaction_interface_1.ETransactionTypes.CREDIT, amount, transactionMessage, pay_with_enum_1.EPayWith.RAZORPAY);
                if (!transaction)
                    throw new httpErrors_1.HTTP401Error("UNKNOWN_ERROR");
                order.order.transactionId = transaction._id;
                order.order.planId = plan.planId;
                razorpay_service_1.default.checkTransactionStatusIn(order.order.id, transaction._id);
                return { order };
            }
            catch (err) {
                throw new httpErrors_1.HTTP401Error(err.message);
            }
        });
    }
    verifyPayment(userId, walletId, body) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = body.orderId + "|" + body.paymentId;
                const expectedSignature = crypto_1.default.createHmac("sha256", index_1.razorPaySecrets.secret)
                    .update(id.toString())
                    .digest("hex");
                const response = { signatureIsValid: false };
                if (expectedSignature === body.razorpay_signature) {
                    const transaction = yield transaction_model_1.default.updateTransactionStatus(body.transactionId, transaction_interface_1.ETransactionStatus.SUCCESS);
                    if ((transaction === null || transaction === void 0 ? void 0 : transaction.metaData) && ((_a = transaction === null || transaction === void 0 ? void 0 : transaction.metaData) === null || _a === void 0 ? void 0 : _a.planId) != plans_interface_1.EPLANS.PAYG) {
                        yield plans_model_1.default.activatePlan(userId, transaction.metaData.planId, transaction._id);
                    }
                    else {
                        yield wallet_model_1.default.addCreditToWallet(walletId, transaction.amount);
                    }
                    response.signatureIsValid = true;
                    return response;
                }
                return response;
            }
            catch (err) {
                console.log(err.message);
                throw new httpErrors_1.HTTP401Error(err.message);
            }
        });
    }
}
exports.RazorPayModel = RazorPayModel;
exports.default = new RazorPayModel();
//# sourceMappingURL=razorpay.model.js.map