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
exports.WalletModel = void 0;
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const transaction_interface_1 = require("./../transaction/transaction.interface");
const httpErrors_1 = require("../../lib/utils/httpErrors");
const bson_1 = require("bson");
const wallet_schema_1 = require("./wallet.schema");
const transaction_model_1 = __importDefault(require("../transaction/transaction.model"));
const transaction_interface_2 = require("../transaction/transaction.interface");
const logger_1 = __importDefault(require("../../core/logger"));
const pay_with_enum_1 = require("../../core/enums/pay-with.enum");
const notify_service_1 = __importDefault(require("../../lib/services/notify.service"));
const logFileName = "[WalletModel] : ";
class WalletModel {
    createWallet(balance = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            const newWallet = new wallet_schema_1.Wallet({ balance: balance });
            const newWalletData = yield newWallet.save();
            logger_1.default.info(logFileName, `New Wallet Created ${newWalletData._id}`);
            return newWalletData;
        });
    }
    deleteWallet(walletId) {
        return __awaiter(this, void 0, void 0, function* () {
            wallet_schema_1.Wallet.findByIdAndDelete(walletId);
        });
    }
    fetchWalletBalance(userId, walletId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("fetch wallet balance ", userId, walletId);
            const walletData = this.fetchWallet(walletId);
            return walletData;
        });
    }
    getTotalWalletBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            const totalBalance = yield wallet_schema_1.Wallet.aggregate([
                { $group: { _id: null, amount: { $sum: "$balance" } } }
            ]);
            return totalBalance[0].amount;
        });
    }
    updateWalletBalance(walletId, balance) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield wallet_schema_1.Wallet.findByIdAndUpdate(walletId, { balance: balance }, { new: true });
        });
    }
    addBalanceToWallet(userId, walletId, amount, currency = "INR") {
        return __awaiter(this, void 0, void 0, function* () {
            const newBalance = yield wallet_schema_1.Wallet.findByIdAndUpdate(walletId, { $inc: { balance: Number(amount) } }, { new: true });
            notify_service_1.default.walletBalanceAdded(userId, amount, newBalance.balance, currency);
            return newBalance;
        });
    }
    fetchTransactions(userId, walletId, page = "1") {
        return __awaiter(this, void 0, void 0, function* () {
            const transactions = yield transaction_model_1.default.fetchTransactions(walletId, parseInt(page));
            return transactions;
        });
    }
    fetchWallet(walletId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield wallet_schema_1.Wallet.aggregate([
                { $match: { _id: new bson_1.ObjectID(walletId) } },
                {
                    $project: {
                        balance: 1
                    }
                }
            ]);
            return result[0] || null;
        });
    }
    fetchWalletByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield wallet_schema_1.Wallet.aggregate([
                { $match: { userId: new bson_1.ObjectID(userId) } },
                {
                    $project: {
                        balance: 1
                    }
                }
            ]);
            return result[0] || null;
        });
    }
    getWalletIdByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = yield wallet_schema_1.Wallet.findOne({ userId: userId });
            if (!wallet)
                throw Error("WALLET_NOT_FOUND");
            return wallet._id;
        });
    }
    addUserToWallet(walletId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield wallet_schema_1.Wallet.findByIdAndUpdate(walletId, { userId });
        });
    }
    addCreditToWallet(walletId, addCredit) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield wallet_schema_1.Wallet.findByIdAndUpdate(walletId, { $inc: { balance: addCredit } });
            if (!result)
                throw new httpErrors_1.HTTP401Error("ERROR_UPDATING_WALLET_BALANCE");
            return result;
        });
    }
    validateTransactionAmount(walletId, amountToDebit) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = yield this.fetchWallet(walletId);
            // logger.debug(logFileName,`Validating transaction amount ${amountToDebit} for wallet ${walletId}`);
            if (!wallet)
                throw new Error("WALLET_NOT_FOUND");
            if (wallet.balance >= amountToDebit)
                return { isValidAmount: true, balance: wallet.balance };
            return { isValidAmount: false, balance: wallet.balance };
        });
    }
    getWalletIdAndValidateTransactionAmount(userId, amountToDebit) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = yield this.fetchWalletByUserId(userId);
            if (!wallet)
                throw new Error("WALLET_NOT_FOUND");
            if (wallet.balance >= amountToDebit)
                return wallet._id;
            throw new Error("NOT_ENOUGH_CREDITS");
        });
    }
    removeCreditFromWallet(walletId, removeCredit) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validateTransactionAmount(walletId, removeCredit);
            const result = yield wallet_schema_1.Wallet.findByIdAndUpdate(walletId, { $inc: { balance: -removeCredit } }, { new: true });
            if (!result)
                throw new httpErrors_1.HTTP401Error("ERROR_UPDATING_WALLET_BALANCE");
            return result;
        });
    }
    makePaymentFromWallet(walletId, userId, amount, description, metaData = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield transaction_model_1.default.createTransactionForWallet(walletId, userId, transaction_interface_2.ETransactionTypes.DEBIT, amount, description, metaData, pay_with_enum_1.EPayWith.WALLET);
            const wallet = yield this.removeCreditFromWallet(walletId, amount);
            transaction_model_1.default.updateTransactionStatus(transaction._id, transaction_interface_1.ETransactionStatus.SUCCESS);
            return { error: false, transaction, wallet };
        });
    }
}
exports.WalletModel = WalletModel;
exports.default = new WalletModel();
//# sourceMappingURL=wallet.model.js.map