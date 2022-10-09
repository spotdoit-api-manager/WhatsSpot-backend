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
exports.QrPayModel = void 0;
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const transaction_interface_1 = require("./../transaction/transaction.interface");
const httpErrors_1 = require("./../../lib/utils/httpErrors");
const transaction_interface_2 = require("../transaction/transaction.interface");
const pay_with_enum_1 = require("../../core/enums/pay-with.enum");
const plans_model_1 = __importDefault(require("../plans/plans.model"));
const transaction_model_1 = __importDefault(require("../transaction/transaction.model"));
const notify_service_1 = __importDefault(require("../../lib/services/notify.service"));
const wallet_model_1 = __importDefault(require("../wallet/wallet.model"));
class QrPayModel {
    createOrder(userId, walletId, transactionId, planId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!transactionId || transactionId.length < 10 || !amount)
                throw new httpErrors_1.HTTP401Error("INVALID TRANSACTION ID", "Entered transaction id is invalid or  amount is invalid");
            const plan = yield plans_model_1.default.fetchPlanByPlanId(planId);
            if (!plan)
                throw new httpErrors_1.HTTP401Error("INVALID PLAN ID", "Entered plan id is invalid");
            const transactionMessage = plan.planId == "PAYG" ? `Payment Request (Add Money to wallet) | TransactionId: ${transactionId}` : `Payment request to Buy Plan -> ${plan.planName} | TransactionId: ${transactionId}`;
            const isAlreadyExist = yield transaction_model_1.default.fetchTransactionByOrderId(transactionId);
            if (isAlreadyExist)
                throw new httpErrors_1.HTTP401Error("TRANSACTION ID ALREADY REQUESTED", "Entered transaction id is already exist");
            const transaction = yield transaction_model_1.default.createTransactionForPlan(plan.planId, transactionId, userId, walletId, transaction_interface_2.ETransactionTypes.CREDIT, amount, transactionMessage, pay_with_enum_1.EPayWith.QR_PAY);
            notify_service_1.default.paymentApproveRequest(userId, planId, amount, transactionId);
            return transaction;
        });
    }
    approvePayment(userId, paymentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield transaction_model_1.default.fetchTransactionById(null, paymentId);
            if (!payment)
                throw new httpErrors_1.HTTP401Error("INVALID PAYMENT ID", "Entered payment id is invalid");
            if (payment.status == transaction_interface_1.ETransactionStatus.SUCCESS)
                throw new httpErrors_1.HTTP401Error("PAYMENT ALREADY APPROVED", "Entered payment id is already approved");
            if (payment.metaData.planId == "PAYG") {
                yield wallet_model_1.default.addBalanceToWallet(payment.userId, payment.walletId, payment.amount);
            }
            else {
                yield plans_model_1.default.activateUserPlan(userId, payment.userId, payment.metaData.planId, "Payment Request Approved");
            }
            notify_service_1.default.paymentApprove(payment.userId, payment.metaData.planId, payment.amount, payment.orderId);
            return transaction_model_1.default.updateTransactionStatus(paymentId, transaction_interface_1.ETransactionStatus.SUCCESS);
        });
    }
    rejectPayment(userId, paymentId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield transaction_model_1.default.fetchTransactionById(null, paymentId);
            if (!payment)
                throw new httpErrors_1.HTTP401Error("INVALID PAYMENT ID", "Entered payment id is invalid");
            if (payment.status == transaction_interface_1.ETransactionStatus.SUCCESS)
                throw new httpErrors_1.HTTP401Error("PAYMENT ALREADY APPROVED", "Entered payment id is already approved");
            notify_service_1.default.paymentRejected(payment.userId, payment.metaData.planId, payment.amount, payment.orderId, reason);
            return transaction_model_1.default.updateTransactionStatus(paymentId, transaction_interface_1.ETransactionStatus.ERROR);
        });
    }
}
exports.QrPayModel = QrPayModel;
exports.default = new QrPayModel();
//# sourceMappingURL=qr-pay.model.js.map