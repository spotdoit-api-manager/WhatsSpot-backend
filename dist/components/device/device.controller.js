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
exports.DeviceController = void 0;
const responseHandler_1 = __importDefault(require("../../lib/helpers/responseHandler"));
const device_model_1 = __importDefault(require("./device.model"));
const message_model_1 = __importDefault(require("../messages/message.model"));
const logger_1 = __importDefault(require("../../lib/utils/logger"));
const logFileName = "[DeviceController]";
class DeviceController {
    constructor() {
        this.newDevice = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("new device request");
                responseHandler
                    .reqRes(req, res)
                    .onFetch("DEVICE_ADDED", yield device_model_1.default.newDevice(req.userId, req.walletId, req.body, req.params.code))
                    .send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.newDeviceCode = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                responseHandler
                    .reqRes(req, res)
                    .onFetch("CODE_SENT", yield device_model_1.default.newDeviceCode(req.userId, req.walletId, req.body))
                    .send();
            }
            catch (e) {
                logger_1.default.error(logFileName, e);
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.getQr = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("qr request");
                responseHandler.reqRes(req, res).onFetch("QR_REQUESTED", yield device_model_1.default.getQr(req.userId, req.params.deviceId)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.removeClient = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("qr request");
                responseHandler.reqRes(req, res).onFetch("QR_REQUESTED", yield device_model_1.default.removeClient(req.userId, req.params.deviceId)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.fetchAllDevices = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("fetch all device request");
                responseHandler.reqRes(req, res).onFetch("DEVICES_FETCHED", yield device_model_1.default.fetchAllDevices(req.userId)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.fetchDevice = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("qr request");
                responseHandler.reqRes(req, res).onFetch("DEVICE_FETCHED", yield device_model_1.default.fetchDevice(req.params.deviceId, req.userId)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.deleteAuth = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("qr request");
                responseHandler.reqRes(req, res).onFetch("AUTH_DELETED", yield device_model_1.default.deleteAuth(req.userId, req.params.deviceId)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.logoutDevice = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("qr request");
                responseHandler.reqRes(req, res).onFetch("DEVICE_LOGGEDOUT", yield device_model_1.default.logoutDevice(req.userId, req.params.deviceId)).send();
            }
            catch (e) {
                // send error with next function.
                logger_1.default.info(logFileName, e);
                next(responseHandler.sendError(e));
            }
        });
        this.generateNewKey = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("qr request");
                responseHandler.reqRes(req, res).onFetch("KEY_GENERATED", yield device_model_1.default.generateNewKey(req.userId, req.walletId, req.params.deviceId, req.body)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.getKeys = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("qr request");
                responseHandler.reqRes(req, res).onFetch("KEYS_FETCHED", yield device_model_1.default.getKeys(req.params.deviceId)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.deleteKey = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("delete key request", req.params);
                responseHandler.reqRes(req, res).onFetch("KEY_DELETED", yield device_model_1.default.deleteKey(req.params.deviceId, req.params.keyId)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.addMessageToQueue = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("add to queue request ", req.params);
                responseHandler.reqRes(req, res).onFetch("ADDED_TO_QUEUE", yield message_model_1.default.addMessageToQueue(req.userId, req.body, req.params.deviceId)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.retryFailedMessage = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                const result = yield device_model_1.default.retryFailedMessage(req.userId, req.params.deviceId);
                console.log("retry result ", result);
                responseHandler.reqRes(req, res).onFetch("RETRYING", result).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.sendTextMessage = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("Send text message request");
                responseHandler.reqRes(req, res).onFetch("MESSAGE_SENT", yield message_model_1.default.sendMessage(req.userId, req.body.to, req.body.message, req.body.messageType, req.params.deviceId, req.walletId)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.sendImageMessage = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("qr request");
                req.body.locationUrl = (_a = req.file) === null || _a === void 0 ? void 0 : _a.location;
                responseHandler.reqRes(req, res).onFetch("SENT_MESSAGE", yield message_model_1.default.sendImageMessage(req.userId, req.params.deviceId, req.body)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.fetchPrevMessages = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("fetch prev message");
                responseHandler.reqRes(req, res).onFetch("Fetched", yield device_model_1.default.fetchPrevMessages(req.params.deviceId)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.fetchDeviceMetrics = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("fetch prev message");
                responseHandler.reqRes(req, res).onFetch("Fetched", yield device_model_1.default.fetchDeviceMetrics(req.params.deviceId)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.removeDevice = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                responseHandler.reqRes(req, res).onFetch("DEVICE_RREMOVED", yield device_model_1.default.removeDevice(req.userId, req.params.deviceId)).send();
            }
            catch (e) {
                // send error with next function.
                console.log(e);
                next(responseHandler.sendError(e));
            }
        });
        this.getDeviceStatus = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                responseHandler.reqRes(req, res).onFetch("DEVICE_STATUS", yield device_model_1.default.getDeviceStatus(req.userId, req.params.deviceId)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
    }
}
exports.DeviceController = DeviceController;
exports.default = new DeviceController();
//# sourceMappingURL=device.controller.js.map