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
exports.validateTestMessageRequest = void 0;
const phone_handler_1 = require("./../../lib/utils/phone.handler");
const httpErrors_1 = require("./../../lib/utils/httpErrors");
const testMessage_model_1 = __importDefault(require("./testMessage.model"));
const config_1 = require("../../config");
exports.validateTestMessageRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const to = (_a = req.body) === null || _a === void 0 ? void 0 : _a.to;
        try {
            req.body.to = phone_handler_1.parsePhone(to).number;
        }
        catch (e) {
            const error = new httpErrors_1.HTTP401Error("INVALID_PHONE", "phone number is invalid");
            next(error);
        }
        const testMessage = yield testMessage_model_1.default.fetchTestMessageByPhoneNumber(to);
        if (testMessage) {
            req.testMessageId = testMessage._id;
            if (testMessage.messageCount < config_1.testMessageConfig.maxMessage) {
                return next();
            }
            const error = new httpErrors_1.HTTP401Error("LIMIT_REACHED", "You have sent maximum message to a number allowed");
            return next(error);
        }
        req.testMessageId = null;
        return next();
    }
    catch (e) {
        next(new httpErrors_1.HTTP401Error(e.message));
    }
});
//# sourceMappingURL=testMessage.middleware.js.map