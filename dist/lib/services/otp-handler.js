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
exports.sendNewDeviceCode = exports.sendMessage = void 0;
const index_1 = require("../utils/index");
const otp_message_service_1 = __importDefault(require("./otp-message.service"));
const helpers_1 = require("../helpers");
const logger_1 = __importDefault(require("../../core/logger"));
const logFileName = "[OTPHandler] : ";
exports.sendMessage = (to, message) => __awaiter(void 0, void 0, void 0, function* () {
    const env = process.env.NODE_ENV;
    if (env == "development")
        return { proceed: true };
    return yield otp_message_service_1.default.sendFast2Sms(index_1.sanatizeMobile(to), message);
});
exports.sendNewDeviceCode = (to) => __awaiter(void 0, void 0, void 0, function* () {
    const env = process.env.NODE_ENV;
    const otp = helpers_1.otpGenerator();
    const message = `Device verification code is ${otp}`;
    logger_1.default.info(logFileName, message);
    if (env == "development")
        return { proceed: true };
    return yield otp_message_service_1.default.sendFast2Sms(index_1.sanatizeMobile(to), message);
});
//# sourceMappingURL=otp-handler.js.map