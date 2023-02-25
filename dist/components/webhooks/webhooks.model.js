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
exports.WebhookModel = void 0;
const index_1 = require("./../../lib/utils/index");
const index_2 = require("./../../lib/helpers/index");
const webhooks_schemas_1 = __importDefault(require("./webhooks.schemas"));
class WebhookModel {
    createWebhookMessage(userId, message, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const newMessage = new webhooks_schemas_1.default(Object.assign(Object.assign({}, message), { userId, status }));
            return yield newMessage.save();
        });
    }
    fetchWebhookMessages(userId, deviceId, page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = 20;
            const q = { userId };
            if (deviceId && deviceId !== "undefined" || deviceId !== "null") {
                (0, index_2.isValidMongoId)(deviceId);
                q.deviceId = deviceId;
            }
            const result = yield webhooks_schemas_1.default.find(q).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean().exec();
            const total = yield webhooks_schemas_1.default.countDocuments(q);
            return (0, index_1.createPaginationData)(result, page, total, limit);
        });
    }
}
exports.WebhookModel = WebhookModel;
// what is .exec() in mongoose?
exports.default = new WebhookModel();
//# sourceMappingURL=webhooks.model.js.map