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
exports.StripePaymentController = void 0;
const responseHandler_1 = __importDefault(require("../../lib/helpers/responseHandler"));
const stripe_model_1 = __importDefault(require("./stripe.model"));
class StripePaymentController {
    constructor() {
        this.createNewSession = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                responseHandler.reqRes(req, res).onFetch("SESSION_CREATED", yield stripe_model_1.default.createNewSession(req.userId, req.walletId, req.body.amount, req.body.planId)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.stripeEvent = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                responseHandler.reqRes(req, res).onFetch("STRIPE_EVENT", yield stripe_model_1.default.stripeEvent(req.body)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.validateSession = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                responseHandler.reqRes(req, res).onFetch("SESSION_VALIDATED", yield stripe_model_1.default.validateSession(req.userId, req.walletId, req.body.sessionId)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.fetchSession = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                responseHandler.reqRes(req, res).onFetch("SESSION_FETCHED", yield stripe_model_1.default.fetchSession(req.userId, req.body.sessionId)).send();
            }
            catch (e) {
                console.log(e);
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.expireSession = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                responseHandler.reqRes(req, res).onFetch("SESSION_EXPIRED", yield stripe_model_1.default.expireSession(req.userId, req.body.sessionId)).send();
            }
            catch (e) {
                console.log(e);
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
    }
}
exports.StripePaymentController = StripePaymentController;
exports.default = new StripePaymentController();
//# sourceMappingURL=stripe.controller.js.map