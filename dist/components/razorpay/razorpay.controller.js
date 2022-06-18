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
exports.RazorPayController = void 0;
const responseHandler_1 = __importDefault(require("../../lib/helpers/responseHandler"));
const razorpay_model_1 = __importDefault(require("./razorpay.model"));
class RazorPayController {
    constructor() {
        this.createNewOrder = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            console.log("create new order");
            try {
                responseHandler.reqRes(req, res).onFetch("ORDER_CREATED", yield razorpay_model_1.default.createOrder(req.userId, req.walletId, req.body.planId, req.body.amount)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.verifyPayment = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            console.log("create new order");
            try {
                responseHandler.reqRes(req, res).onFetch("ORDER_CREATED", yield razorpay_model_1.default.verifyPayment(req.userId, req.walletId, req.body)).send();
            }
            catch (e) {
                // send error with next function.
                console.log("error", e);
                next(responseHandler.sendError(e.message));
            }
        });
    }
}
exports.RazorPayController = RazorPayController;
exports.default = new RazorPayController();
//# sourceMappingURL=razorpay.controller.js.map