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
exports.StripePaymentModel = void 0;
const plans_interface_1 = require("./../plans/plans.interface");
const transaction_interface_1 = require("./../transaction/transaction.interface");
/* eslint-disable @typescript-eslint/camelcase */
const httpErrors_1 = require("../../lib/utils/httpErrors");
const config_1 = require("../../config");
const plans_model_1 = __importDefault(require("../plans/plans.model"));
const transaction_model_1 = __importDefault(require("../transaction/transaction.model"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const stripe = require("stripe")(config_1.stripeConfig.secretKey);
class StripePaymentModel {
    addProduct(productBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield stripe.products.create(productBody);
        });
    }
    getProducts(userId, limit = 10) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield stripe.products.list({
                limit,
            });
        });
    }
    createPrice(userId, priceBody) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("creating price ", priceBody);
            yield stripe.prices.create(priceBody);
        });
    }
    getPrices(userId, limit = 10) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield stripe.prices.list({
                limit,
            });
        });
    }
    createNewSession(userId, walletId, amount, planId) {
        return __awaiter(this, void 0, void 0, function* () {
            const plan = yield plans_model_1.default.fetchPlanByPlanId(planId);
            if (!plan)
                throw new httpErrors_1.HTTP401Error("INVALID_PLAN", "The plan you have request doesnt exists");
            const transaction = yield transaction_model_1.default.createTransactionForPlan(planId, "STRIPE", userId, walletId, transaction_interface_1.ETransactionTypes.CREDIT, plan.planAmount, plan.planName);
            if (!transaction)
                throw new httpErrors_1.HTTP401Error("UNKNOWN_ERROR", "Unable to create transaction");
            const session = yield stripe.checkout.sessions.create({
                line_items: [
                    {
                        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                        price: plan.stripePriceId,
                        quantity: planId == plans_interface_1.EPLANS.PAYG ? amount : 1,
                    },
                ],
                mode: "payment",
                metadata: {
                    userId: userId.toString(),
                    planId: planId.toString(),
                    transactionId: transaction._id.toString()
                },
                success_url: `${config_1.commonConfig.domain}/user/wallet`,
                cancel_url: `${config_1.commonConfig.domain}/user/wallet`,
            });
            return { sessionId: session.id, sessionUrl: session.url, amount: session.amount_total, expiresAt: session.expires_at };
        });
    }
    validateSession(userId, walletId, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield stripe.checkout.sessions.retrieve(sessionId);
            if (session.metadata.userId !== userId.toString())
                throw new httpErrors_1.HTTP401Error("INVALID_SESSION", "The session you are trying to validate is not valid");
            const transaction = yield transaction_model_1.default.fetchTransactionById(walletId, session.metadata.transactionId);
            if (transaction.status !== transaction_interface_1.ETransactionStatus.PENDING)
                throw new httpErrors_1.HTTP401Error("INVALID_SESSION", "The session you are trying to validate is already credited");
            yield plans_model_1.default.activatePlan(userId, session.metadata.planId, transaction._id);
            transaction_model_1.default.updateTransactionStatus(session.metadata.transactionId, transaction_interface_1.ETransactionStatus.SUCCESS);
        });
    }
    fetchSession(userId, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield stripe.checkout.sessions.retrieve(sessionId);
        });
    }
    expireSession(userId, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield stripe.checkout.sessions.expire(sessionId);
        });
    }
    stripeEvent(body) {
        console.log("stripe event", body);
    }
}
exports.StripePaymentModel = StripePaymentModel;
exports.default = new StripePaymentModel();
//# sourceMappingURL=stripe.model.js.map