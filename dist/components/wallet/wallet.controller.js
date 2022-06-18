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
exports.WalletController = void 0;
const exchange_rate_service_1 = require("../../lib/services/exchange-rate.service");
const responseHandler_1 = __importDefault(require("../../lib/helpers/responseHandler"));
const wallet_model_1 = __importDefault(require("./wallet.model"));
class WalletController {
    constructor() {
        this.fetchBalance = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            console.log("fetch wallet balance");
            try {
                const result = yield wallet_model_1.default.fetchWalletBalance(req.userId, req.walletId);
                responseHandler.reqRes(req, res).onCreate("BALANCE_FETCHED", result).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.fetchTransactions = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                const result = yield wallet_model_1.default.fetchTransactions(req.userId, req.walletId, req.query.page);
                responseHandler.reqRes(req, res).onCreate("TRANSACTION_FETCHED", result).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.getRate = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                const result = yield exchange_rate_service_1.getRate();
                responseHandler.reqRes(req, res).onCreate("TRANSACTION_FETCHED", result).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
    }
}
exports.WalletController = WalletController;
exports.default = new WalletController();
//# sourceMappingURL=wallet.controller.js.map