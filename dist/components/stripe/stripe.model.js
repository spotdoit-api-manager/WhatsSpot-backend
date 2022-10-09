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
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const pay_with_enum_1 = require("./../../core/enums/pay-with.enum");
const plans_interface_1 = require("./../plans/plans.interface");
const transaction_interface_1 = require("./../transaction/transaction.interface");
const httpErrors_1 = require("../../lib/utils/httpErrors");
const config_1 = require("../../config");
const plans_model_1 = __importDefault(require("../plans/plans.model"));
const transaction_model_1 = __importDefault(require("../transaction/transaction.model"));
const wallet_model_1 = __importDefault(require("../wallet/wallet.model"));
const user_model_1 = __importDefault(require("../user/user.model"));
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
                throw new httpErrors_1.HTTP401Error("INVALID_PLAN", "The plan you have request doesn't exists");
            const user = yield user_model_1.default.getUserById(userId);
            const finalAmount = planId === plans_interface_1.EPLANS.PAYG ? amount : plan.planAmount;
            const currency = user.country === "IN" ? "INR" : "USD";
            const session = yield stripe.checkout.sessions.create({
                line_items: [
                    {
                        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                        // currency,
                        price: plan.stripePriceId,
                        quantity: planId == plans_interface_1.EPLANS.PAYG ? amount : 1,
                    },
                ],
                mode: "payment",
                metadata: {
                    userId: userId.toString(),
                    planId: planId.toString(),
                },
                success_url: `${config_1.commonConfig.domain}/user/wallet`,
                cancel_url: `${config_1.commonConfig.domain}/user/wallet`,
            }).catch((err) => {
                console.log("error creating session", err);
                throw new httpErrors_1.HTTP401Error("STRIPE_SESSION_ERROR", err.message);
            });
            const transaction = yield transaction_model_1.default.createTransactionForPlan(planId, session.id, userId, walletId, transaction_interface_1.ETransactionTypes.CREDIT, finalAmount, plan.planName, pay_with_enum_1.EPayWith.STRIPE);
            if (!transaction)
                throw new httpErrors_1.HTTP401Error("UNKNOWN_ERROR", "Unable to create transaction");
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
    stripeEvent(event) {
        // console.log("stripe event",body);
        switch (event.type) {
            case "checkout.session.completed":
                this.sessionSucceed(event);
                break;
            case "checkout.session.canceled":
                this.sessionCancelled(event);
                break;
            case "checkout.session.payment_failed":
                this.sessionFailed(event);
                break;
            case "checkout.session.expired":
                this.sessionExpired(event);
            default:
                console.log("unknown event", event.type);
        }
    }
    sessionSucceed(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = event.data.object;
            console.log("session succeeded", session);
            console.log("session succeeded", session.metadata);
            const ordinalSession = yield this.fetchSession(session.metadata.userId, session.id);
            if (!ordinalSession)
                throw new httpErrors_1.HTTP401Error("INVALID_SESSION", "The session you are trying to validate is not valid");
            const transaction = yield transaction_model_1.default.fetchTransactionByOrderId(session.id);
            console.log("original session is ", ordinalSession);
            console.log("transaction is ", transaction);
            if (transaction.status !== transaction_interface_1.ETransactionStatus.PENDING)
                throw new httpErrors_1.HTTP401Error("INVALID_SESSION", "The session you are trying to validate is already validated");
            if (transaction.metaData.planId === plans_interface_1.EPLANS.PAYG) {
                yield wallet_model_1.default.addBalanceToWallet(transaction.userId, transaction.walletId, transaction.amount);
            }
            else {
                yield plans_model_1.default.activatePlan(session.metadata.userId, session.metadata.planId, transaction._id);
            }
            transaction_model_1.default.updateTransactionStatus(transaction._id, transaction_interface_1.ETransactionStatus.SUCCESS);
        });
    }
    sessionFailed(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = event.data.object;
            console.log("session failed", session.id);
            const transaction = yield transaction_model_1.default.fetchTransactionByOrderId(session.id);
            transaction_model_1.default.updateTransactionStatus(transaction._id, transaction_interface_1.ETransactionStatus.ERROR);
        });
    }
    sessionCancelled(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = event.data.object;
            console.log("session cancelled", event.id);
            const transaction = yield transaction_model_1.default.fetchTransactionByOrderId(session.id);
            transaction_model_1.default.updateTransactionStatus(transaction._id, transaction_interface_1.ETransactionStatus.CANCELLED);
        });
    }
    sessionExpired(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = event.data.object;
            console.log("session expired", event.id);
            const transaction = yield transaction_model_1.default.fetchTransactionByOrderId(session.id);
            transaction_model_1.default.updateTransactionStatus(transaction._id, transaction_interface_1.ETransactionStatus.EXPIRED);
        });
    }
    validateSignature(body, sig, secret) {
        return stripe.webhooks.constructEvent(body, sig, secret);
    }
}
exports.StripePaymentModel = StripePaymentModel;
exports.default = new StripePaymentModel();
//# sourceMappingURL=stripe.model.js.map