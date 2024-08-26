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
const message_service_1 = __importDefault(require("./message.service"));
const logger_1 = __importDefault(require("../../core/logger"));
const libphonenumber_js_1 = require("libphonenumber-js");
const logFileName = "[OTPHandler] : ";
const sendMessage = (to, message) => __awaiter(void 0, void 0, void 0, function* () {
    const env = process.env.NODE_ENV;
    const phone = (0, libphonenumber_js_1.parseNumber)(to);
    message_service_1.default.sendWhatsappMessage(to, message);
    if (env == "development")
        return { proceed: true };
    if (phone.country == "IN") {
        return yield message_service_1.default.sendFast2Sms((0, index_1.sanatizeMobile)(phone.phone), message);
    }
    else {
        logger_1.default.info(`Mobile SMS not supported for ${phone === null || phone === void 0 ? void 0 : phone.country}`);
    }
});
exports.sendMessage = sendMessage;
const sendNewDeviceCode = (to, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const env = process.env.NODE_ENV;
    const message = `Your Device verification code is ${otp}`;
    logger_1.default.info(logFileName, message);
    message_service_1.default.sendWhatsappMessage((0, index_1.sanatizeMobile)(to), message);
    const phone = (0, libphonenumber_js_1.parseNumber)(to);
    console.log(phone);
    if (env == "development")
        return { proceed: true };
    if (phone.country == "IN") {
        return yield message_service_1.default.sendFast2Sms((0, index_1.sanatizeMobile)(phone.phone), message);
    }
    else {
        logger_1.default.info(`Mobile SMS not supported for ${phone === null || phone === void 0 ? void 0 : phone.country}`);
    }
});
exports.sendNewDeviceCode = sendNewDeviceCode;
//# sourceMappingURL=otp-handler.js.map