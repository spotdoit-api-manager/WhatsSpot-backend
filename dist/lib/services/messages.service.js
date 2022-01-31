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
exports.MessagesService = void 0;
const logger_1 = require("@/utils/logger");
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("config"));
const plivo = require('plivo');
const plivoCreds = config_1.default.get('communications.sms.plivo');
const fast2SmsCreds = config_1.default.get('communications.sms.fast2sms');
class MessagesService {
    constructor() {
        this._whatsappConfig = config_1.default.get('communications.whatsapp.config');
        const { authId, authToken } = plivoCreds;
        this._plivoClient = new plivo.Client(authId, authToken);
    }
    sendWhatsappMessage(fullNumber, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const sendUrl = this._whatsappConfig.baseApi + this._whatsappConfig.messageApi;
            let result;
            try {
                result = yield axios_1.default.post(sendUrl, { phoneNumber: fullNumber, message }, { headers: { 'content-type': 'application/json' } });
                return result.data;
            }
            catch (err) {
                logger_1.logger.error(`[MessagesService]: Failed to send whatsapp message. ` + err);
                return result;
            }
        });
    }
    sendWhatsappMessageFast(fullNumber, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const sendUrl = this._whatsappConfig.baseApi + this._whatsappConfig.messageApi;
            let result;
            try {
                result = yield axios_1.default.post(sendUrl, { phoneNumber: fullNumber, message, fast: true }, { headers: { 'content-type': 'application/json' } });
                return result.data;
            }
            catch (err) {
                logger_1.logger.error(`[MessagesService]: Failed to send fast whatsapp message. ` + err);
                return result;
            }
        });
    }
    sendSMS(fullNumber, message) {
        return __awaiter(this, void 0, void 0, function* () {
            this._plivoClient.messages.create(plivoCreds.sourceNumber, fullNumber, message);
        });
    }
    sendFast2Sms(number, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = {
                route: 'v3',
                sender_id: fast2SmsCreds.senderId,
                message: message,
                language: 'english',
                flash: 0,
                numbers: number,
            };
            try {
                const result = yield axios_1.default.post(fast2SmsCreds.url, body, {
                    headers: { authorization: fast2SmsCreds.authToken, 'content-type': 'application/json' },
                });
                return result.data;
            }
            catch (err) {
                logger_1.logger.error('sendFast2Sms send error' + err);
            }
        });
    }
}
exports.MessagesService = MessagesService;
exports.default = new MessagesService();
//# sourceMappingURL=messages.service.js.map