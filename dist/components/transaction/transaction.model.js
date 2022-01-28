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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModel = void 0;
const bson_1 = require("bson");
const httpErrors_1 = require("./../../lib/utils/httpErrors");
const transaction_schema_1 = require("./transaction.schema");
const transaction_interface_1 = require("./transaction.interface");
class TransactionModel {
    fetchTransactions(walletId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield transaction_schema_1.Transaction.aggregate([
                { $match: { walletId: new bson_1.ObjectID(walletId) } },
                { $sort: { createdAt: -1 } },
                {
                    $project: {
                        amount: 1,
                        status: 1,
                        type: 1,
                        dateTime: "$createdAt",
                        description: 1,
                    }
                }
            ]);
            console.log("got transaciton", result);
            return result;
        });
    }
    createTransaction(orderId, userId, walletId, type, amount, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transactionBody = {
                    orderId,
                    userId,
                    walletId,
                    type,
                    amount,
                    description,
                    status: transaction_interface_1.ETransactionStatus.PENDING
                };
                const newTransaction = new transaction_schema_1.Transaction(transactionBody);
                const transaction = yield newTransaction.addTransaction();
                if (!transaction)
                    throw new httpErrors_1.HTTP401Error("UNKNOW_ERROR");
                return transaction;
            }
            catch (err) {
                throw new httpErrors_1.HTTP401Error(err.message);
            }
        });
    }
    updateTransactionStatus(transactionId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedTransaction = yield transaction_schema_1.Transaction.findByIdAndUpdate(transactionId, { $set: { status: status } });
            if (!updatedTransaction)
                throw new httpErrors_1.HTTP401Error("ERROR_UPDATING_TRANSACTION_STATUS");
            return updatedTransaction;
        });
    }
}
exports.TransactionModel = TransactionModel;
exports.default = new TransactionModel();
//# sourceMappingURL=transaction.model.js.map