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
class RazorPayModel {
    createOrder(userId, walletId, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield razorpay_service_1.default.createOrder(userId, body);
                if (!order)
                    throw new httpErrors_1.HTTP401Error("UNKNOWN_ERROR");
                console.log(order);
                if (order.error)
                    throw new httpErrors_1.HTTP401Error(order.message);
                const transaction = yield transaction_model_1.default.createTransaction(order.order.id, userId, walletId, transaction_interface_1.ETransactionTypes.CREDIT, body.amount, "amount adding to wallet");
                if (!transaction)
                    throw new httpErrors_1.HTTP401Error("UNKNOWN_ERROR");
                order.order.transactionId = transaction._id;
                return { order };
            }
            catch (err) {
                throw new httpErrors_1.HTTP401Error(err.message);
            }
        });
    }
    verifyPayment(userId, walletId, body) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("got verification of ", userId, walletId, body);
            try {
                let id = body.orderId + "|" + body.paymentId;
                const expectedSignature = crypto_1.default.createHmac('sha256', index_1.razorPaySecrets.secret)
                    .update(id.toString())
                    .digest('hex');
                console.log("sig received ", body.razorpay_signature);
                console.log("sig generated ", expectedSignature);
                let response = { signatureIsValid: false };
                if (expectedSignature === body.razorpay_signature) {
                    const updatedTransaction = yield transaction_model_1.default.updateTransactionStatus(body.transactionId, transaction_interface_1.ETransactionStatus.SUCCESS);
                    const updatedWallet = yield wallet_model_1.default.addCreditToWallet(walletId, updatedTransaction.amount);
                    console.log(updatedTransaction, updatedWallet);
                    response.signatureIsValid = true;
                    return response;
                }
                console.log("returning ", response);
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