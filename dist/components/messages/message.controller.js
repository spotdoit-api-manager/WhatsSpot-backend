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
exports.MessageController = void 0;
const whatsapp_enum_1 = require("../../lib/services/whatsapp/whatsapp.enum");
const responseHandler_1 = __importDefault(require("../../lib/helpers/responseHandler"));
const testMessage_model_1 = __importDefault(require("../testMessage/testMessage.model"));
const message_model_1 = __importDefault(require("./message.model"));
const logFileName = "[MessageController]";
class MessageController {
    constructor() {
        this.queueTextMessage = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                req.body.messageType = whatsapp_enum_1.EWhatsappMessageTypes.TEXT_MESSAGE;
                responseHandler.reqRes(req, res).onFetch("ADDED_TO_QUEUE", yield message_model_1.default.addMessageToQueue(req.userId, req.body, req.deviceId)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.queueListMessage = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                req.body.messageType = whatsapp_enum_1.EWhatsappMessageTypes.LIST_MESSAGE;
                responseHandler.reqRes(req, res).onFetch("ADDED_TO_QUEUE", yield message_model_1.default.addMessageToQueue(req.userId, req.body, req.deviceId)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.queueBtnMessage = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                req.body.messageType = whatsapp_enum_1.EWhatsappMessageTypes.BUTTON_MESSAGE;
                responseHandler.reqRes(req, res).onFetch("ADDED_TO_QUEUE", yield message_model_1.default.addMessageToQueue(req.userId, req.body, req.deviceId)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.queueTemplateMessage = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                req.body.messageType = whatsapp_enum_1.EWhatsappMessageTypes.TEMPLATE_MESSAGE;
                responseHandler.reqRes(req, res).onFetch("ADDED_TO_QUEUE", yield message_model_1.default.addMessageToQueue(req.userId, req.body, req.deviceId)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.addToQueue = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("add to queue request ", req.params);
                responseHandler.reqRes(req, res).onFetch("ADDED_TO_QUEUE", yield message_model_1.default.addMessageToQueue(req.userId, req.body, req.deviceId)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.fastText = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                req.body.messageType = whatsapp_enum_1.EWhatsappMessageTypes.TEXT_MESSAGE;
                responseHandler.reqRes(req, res).onFetch("MESSAGE_SENT", yield message_model_1.default.sendFastMessage(req.userId, req.body.numbers, req.body.message, req.body.messageType, req.deviceId, req.walletId)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.fastList = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                req.body.messageType = whatsapp_enum_1.EWhatsappMessageTypes.LIST_MESSAGE;
                responseHandler.reqRes(req, res).onFetch("MESSAGE_SENT", yield message_model_1.default.sendFastMessage(req.userId, req.body.numbers, req.body.message, req.body.messageType, req.deviceId, req.walletId)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.fastBtn = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                req.body.messageType = whatsapp_enum_1.EWhatsappMessageTypes.BUTTON_MESSAGE;
                responseHandler.reqRes(req, res).onFetch("MESSAGE_SENT", yield message_model_1.default.sendFastMessage(req.userId, req.body.numbers, req.body.message, req.body.messageType, req.deviceId, req.walletId)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.fastTemplate = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                req.body.messageType = whatsapp_enum_1.EWhatsappMessageTypes.TEMPLATE_MESSAGE;
                responseHandler.reqRes(req, res).onFetch("MESSAGE_SENT", yield message_model_1.default.sendFastMessage(req.userId, req.body.numbers, req.body.message, req.body.messageType, req.deviceId, req.walletId)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.sendTextMessage = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("Send text message request", req.userId, req.walletId, req.deviceId);
                responseHandler.reqRes(req, res).onFetch("MESSAGE_SENT", yield message_model_1.default.sendMessage(req.userId, req.body.to, req.body.message, req.body.messageType, req.deviceId, req.walletId)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.sendTestMessage = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("Send test message request", req.userId, req.walletId, req.deviceId);
                responseHandler.reqRes(req, res).onFetch("MESSAGE_SENT", yield testMessage_model_1.default.sendTestMessage(req.body, req.testMessageId)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.sendRawMessage = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("Send raw message request", req.body.deviceId, req.body.message);
                responseHandler.reqRes(req, res).onFetch("MESSAGE_SENT", yield testMessage_model_1.default.sendRawMessage(req.body.to, req.body.message)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
    }
}
exports.MessageController = MessageController;
exports.default = new MessageController();
//# sourceMappingURL=message.controller.js.map