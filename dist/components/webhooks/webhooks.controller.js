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
exports.WebhookController = void 0;
const responseHandler_1 = __importDefault(require("../../lib/helpers/responseHandler"));
const webhooks_model_1 = __importDefault(require("./webhooks.model"));
class WebhookController {
    constructor() {
        this.fetchWebhooksMessage = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const responseHandler = new responseHandler_1.default();
            try {
                const result = yield webhooks_model_1.default.fetchWebhookMessages(req.userId, (_a = req.query) === null || _a === void 0 ? void 0 : _a.deviceId, parseInt(((_b = req.query) === null || _b === void 0 ? void 0 : _b.page) || "1"));
                responseHandler.reqRes(req, res).onCreate("WEBHOOK_MESSAGES_FETCHED", result).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
    }
}
exports.WebhookController = WebhookController;
exports.default = new WebhookController();
//# sourceMappingURL=webhooks.controller.js.map