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
const httpErrors_1 = require("./../../lib/utils/httpErrors");
const bson_1 = require("bson");
const wallet_schema_1 = require("./wallet.schema");
const transaction_model_1 = __importDefault(require("../transaction/transaction.model"));
class WalletModel {
    createWallet(balance = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            const newWallet = new wallet_schema_1.Wallet({ balance: balance });
            const newWalletData = yield newWallet.save();
            console.log(newWalletData);
            return newWalletData;
        });
    }
    fetchWalletByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield wallet_schema_1.Wallet.findOne({ userId: new bson_1.ObjectID(userId) });
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
                { $match: { _id: walletId } },
                {
                    $project: {
                        balance: 1
                    }
                }
            ]);
            return result[0] || null;
        });
    }
    addUserToWallet(walletId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield wallet_schema_1.Wallet.findByIdAndUpdate(walletId, { userId });
        });
    }
    addCreditToWallet(walletId, addBalance = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield wallet_schema_1.Wallet.findByIdAndUpdate(walletId, { $inc: { balance: addBalance } });
            if (!result)
                throw new httpErrors_1.HTTP401Error("ERROR_UPDATING_WALLET_BALANCE");
            return result;
        });
    }
}
exports.WalletModel = WalletModel;
exports.default = new WalletModel();
//# sourceMappingURL=wallet.model.js.map