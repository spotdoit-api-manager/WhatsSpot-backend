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
const transaction_interface_1 = require("../transaction/transaction.interface");
const pay_with_enum_1 = require("../../core/enums/pay-with.enum");
const plans_model_1 = __importDefault(require("../plans/plans.model"));
const transaction_model_1 = __importDefault(require("../transaction/transaction.model"));
class QrPayModel {
    createOrder(userId, walletId, planId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const plan = yield plans_model_1.default.fetchPlanByPlanId(planId);
            const transactionMessage = plan.planId == "PAYG" ? "Adding money to wallet" : `Buying plan -> ${plan.planName}`;
            const transaction = yield transaction_model_1.default.createTransactionForPlan(plan.planId, pay_with_enum_1.EPayWith.QR_PAY, userId, walletId, transaction_interface_1.ETransactionTypes.CREDIT, amount, transactionMessage);
            return transaction;
        });
    }
}
exports.QrPayModel = QrPayModel;
exports.default = new QrPayModel();
//# sourceMappingURL=qrPay.model.js.map