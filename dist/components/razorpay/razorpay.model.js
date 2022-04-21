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
const transaction_interface_1 = require("../transaction/transaction.interface");
const transaction_model_1 = __importDefault(require("../transaction/transaction.model"));
const index_1 = require("./../../config/index");
const httpErrors_1 = require("./../../lib/utils/httpErrors");
const razorpay_service_1 = __importDefault(require("./razorpay.service"));
const wallet_model_1 = __importDefault(require("../walllet/wallet.model"));
const crypto_1 = __importDefault(require("crypto"));
const plans_interface_1 = require("../plans/plans.interface");
const plans_model_1 = __importDefault(require("../plans/plans.model"));
class RazorPayModel {
    createOrder(userId, walletId, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const plan = yield plans_model_1.default.fetchPlanByPlanId(body.planId);
                console.log("fetch plan ", plan);
                if (!plan)
                    throw new Error("INVALID_PLAN");
                const order = yield razorpay_service_1.default.createOrder(userId, body);
                if (!order)
                    throw new Error("UNKNOWN_ERROR");
                console.log(order);
                if (order.error)
                    throw new Error(order.message);
                const transactionMessage = plan.planId == "PAYG" ? "Adding money to wallet" : `Buying plan -> ${plan.planName}`;
                const transaction = yield transaction_model_1.default.createTransactionForRazorPay(plan.planId, order.order.id, userId, walletId, transaction_interface_1.ETransactionTypes.CREDIT, body.amount, transactionMessage);
                if (!transaction)
                    throw new Error("UNKNOWN_ERROR");
                order.order.transactionId = transaction._id;
                order.order.planId = plan.planId;
                return { order };
            }
            catch (err) {
                console.log("error in create order ");
                console.log(err);
                throw new Error(err.message);
            }
        });
    }
    verifyPayment(userId, walletId, body) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("got verification of ", userId, walletId, body);
            try {
                const id = body.orderId + "|" + body.paymentId;
                const expectedSignature = crypto_1.default.createHmac("sha256", index_1.razorPaySecrets.secret)
                    .update(id.toString())
                    .digest("hex");
                console.log("sig received ", body.razorpay_signature);
                console.log("sig generated ", expectedSignature);
                const response = { signatureIsValid: false };
                if (expectedSignature === body.razorpay_signature) {
                    const updatedTransaction = yield transaction_model_1.default.updateTransactionStatus(body.transactionId, transaction_interface_1.ETransactionStatus.SUCCESS);
                    console.log("Updated transaction is ", updatedTransaction);
                    console.log("Updated transaction metadata is ", updatedTransaction.metaData, updatedTransaction.metaData.planId);
                    if ((updatedTransaction === null || updatedTransaction === void 0 ? void 0 : updatedTransaction.metaData) && (updatedTransaction === null || updatedTransaction === void 0 ? void 0 : updatedTransaction.metaData.get("planId")) != plans_interface_1.EPLANS.PAYG) {
                        console.log("Plan payment verified ");
                        const activatedPlan = yield plans_model_1.default.activatePlan(userId, updatedTransaction.metaData.get("planId"), updatedTransaction._id);
                        console.log(activatedPlan);
                    }
                    else {
                        console.log("Wallet payment verified");
                        const updatedWallet = yield wallet_model_1.default.addCreditToWallet(walletId, updatedTransaction.amount);
                    }
                    response.signatureIsValid = true;
                    return response;
                }
                // console.log("returning ",response);
                return response;
            }
            catch (err) {
                throw new httpErrors_1.HTTP401Error(err.message);
            }
        });
    }
}
exports.RazorPayModel = RazorPayModel;
exports.default = new RazorPayModel();
//# sourceMappingURL=razorpay.model.js.map