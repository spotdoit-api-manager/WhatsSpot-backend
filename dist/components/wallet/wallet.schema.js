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
exports.Wallet = void 0;
const mongoose_1 = require("mongoose");
const WalletSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: "user",
    },
    balance: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});
WalletSchema.methods.addNewAllet = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return this.save();
    });
};
const TransactionSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: "user",
        required: true
    },
    walletId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: "wallet",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["ERROR", "PENDING", "SUCCESS"],
        required: true
    },
    type: {
        type: String,
        enum: ["CREDIT", "DEBIT"],
        required: true
    }
}, {
    timestamps: true
});
exports.Wallet = (0, mongoose_1.model)("wallet", WalletSchema);
//# sourceMappingURL=wallet.schema.js.map