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
const httpErrors_1 = require("../../lib/utils/httpErrors");
const bson_1 = require("bson");
const wallet_schema_1 = require("./wallet.schema");
const transaction_model_1 = __importDefault(require("../transaction/transaction.model"));
const transaction_interface_1 = require("../transaction/transaction.interface");
const logger_1 = __importDefault(require("../../core/logger"));
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
    fetchWalletBalance(userId, walletId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("fetch wallet balance ", userId, walletId);
            const walletData = this.fetchWallet(walletId);
            return walletData;
        });
    }
    fetchTransactions(userId, walletId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("fetch wallet transaciton ", userId, walletId);
            const transactions = yield transaction_model_1.default.fetchTransactions(walletId);
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
            console.log("wallet result ", result);
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
            console.log("wallet result ", result);
            return result[0] || null;
        });
    }
    getWalletIdByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = yield wallet_schema_1.Wallet.findOne({ userId: new bson_1.ObjectID(userId) });
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
            logger_1.default.info(logFileName, `Validating transaction amount ${amountToDebit} for wallet ${walletId}`);
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
            const transaction = transaction_model_1.default.createTransactionForWallet(walletId, userId, transaction_interface_1.ETransactionTypes.DEBIT, amount, description, metaData);
            const wallet = yield this.removeCreditFromWallet(walletId, amount);
            return { error: false, transaction, wallet };
        });
    }
}
exports.WalletModel = WalletModel;
exports.default = new WalletModel();
//# sourceMappingURL=wallet.model.js.map