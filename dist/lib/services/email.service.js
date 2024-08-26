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
exports.sendVerificationMail = exports.sendNotificationMail = void 0;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const MailazyClient = require("mailazy-node");
const logger_1 = __importDefault(require("../../core/logger"));
const config_1 = require("../../config");
const httpErrors_1 = require("../utils/httpErrors");
const logFileName = "[EmailService]: ";
const sendNotificationMail = (to, subject, text, html = "") => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = new MailazyClient({ accessKey: config_1.mailazyConfig.accessKey, accessSecret: config_1.mailazyConfig.accessSecret });
        const res = yield client.send({
            to,
            from: process.env.NOTIFICATION_EMAIL,
            subject,
            text,
            html
        });
        logger_1.default.info(logFileName, `Email to ${to} sent successfully`, res);
    }
    catch (e) {
        logger_1.default.error(logFileName, `Error in sending mail to ${to}`, e);
    }
});
exports.sendNotificationMail = sendNotificationMail;
const sendVerificationMail = (to, subject, text = "", html) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new MailazyClient({ accessKey: config_1.mailazyConfig.accessKey, accessSecret: config_1.mailazyConfig.accessSecret });
    logger_1.default.info(logFileName, `Sending verification mail to ${to},html: ${html}`);
    let res = yield client.send({
        to,
        from: process.env.NOTIFICATION_EMAIL,
        subject,
        text,
        html
    });
    res = JSON.parse(res);
    if (res.error)
        throw new httpErrors_1.HTTP400Error("Email Error", res.message);
    logger_1.default.info(logFileName, `Email to ${to} sent successfully`, res);
    return res;
});
exports.sendVerificationMail = sendVerificationMail;
//# sourceMappingURL=email.service.js.map