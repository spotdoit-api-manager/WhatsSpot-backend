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
exports.PayPalController = void 0;
const responseHandler_1 = __importDefault(require("../../lib/helpers/responseHandler"));
const paypal_model_1 = __importDefault(require("./paypal.model"));
class PayPalController {
    constructor() {
        this.createOrder = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                responseHandler.reqRes(req, res).onFetch("ORDER_CREATED", yield paypal_model_1.default.createOrder(req.userId, req.walletId, req.body.planId, req.body.amount, req.body.currency)).send();
            }
            catch (e) {
                // send error with next function.
                console.log("error in creating order ", e);
                next(responseHandler.sendError(e));
            }
        });
        this.verifyOrder = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                responseHandler.reqRes(req, res).onFetch("ORDER_VERIFIED", yield paypal_model_1.default.verifyOrder(req.userId, req.walletId, req.body.orderId, req.body.transactionId)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
    }
}
exports.PayPalController = PayPalController;
exports.default = new PayPalController();
//# sourceMappingURL=paypal.controller.js.map