"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePhone = exports.parsePhoneWithCountry = void 0;
const index_1 = require("./index");
const httpErrors_1 = require("./httpErrors");
const max_1 = require("libphonenumber-js/max");
const logger_1 = __importDefault(require("../../core/logger"));
const logFileName = "[PhoneHandler] : ";
const parsePhoneWithCountry = (phone, country) => {
    try {
        const parsedPhone = (0, max_1.parsePhoneNumberWithError)(phone, country);
        if (!parsedPhone.isValid())
            throw new Error("INVALID_PHONE");
        return { number: parsedPhone.number };
    }
    catch (e) {
        logger_1.default.error(logFileName, e.message);
        throw new httpErrors_1.HTTP400Error(e.message);
    }
};
exports.parsePhoneWithCountry = parsePhoneWithCountry;
const parsePhone = (phone) => {
    try {
        // console.log("parsing phone",phone);
        phone = (0, index_1.deSanatizeMobile)(phone);
        const parsedPhone = (0, max_1.parsePhoneNumber)((0, index_1.deSanatizeMobile)(phone));
        if (!parsedPhone.isValid())
            throw new Error(`Phone ${phone} is invalid`);
        return { number: parsedPhone.number };
    }
    catch (e) {
        logger_1.default.error(logFileName, e.message + `at ${phone}`);
        throw new httpErrors_1.HTTP400Error(e.message + ` at ${phone}`);
    }
};
exports.parsePhone = parsePhone;
//# sourceMappingURL=phone.handler.js.map