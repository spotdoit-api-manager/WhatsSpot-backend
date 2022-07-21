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
exports.SocketManager = void 0;
const config_1 = require("../../config");
const logger_1 = __importDefault(require("../../core/logger"));
let webClient;
class SocketManager {
    constructor() {
        this.socketServer = (server) => __awaiter(this, void 0, void 0, function* () {
            const io = require("socket.io")(server, {
                cors: true,
                origin: config_1.configCors.allowOrigin,
            });
            io.on("connection", (socket) => {
                logger_1.default.info("socket connected ");
                logger_1.default.info(socket.id);
                webClient = socket;
            });
        });
        this.sendClientError = (phone, error) => {
            if (!webClient)
                return logger_1.default.error("webClient not connected..");
            webClient.emit(`${phone}_clientError`, { reason: error });
        };
        this.sendQrCode = (phone, qrData) => {
            logger_1.default.info("emittinq qr to ", `${phone}_qr`);
            if (!webClient)
                return logger_1.default.error("webClient not connected..");
            webClient.emit(`${phone}_qr`, qrData);
        };
        this.sendAuthenticated = (phone) => {
            if (!webClient)
                return logger_1.default.error("webClient not connected..");
            webClient.emit(`${phone}_authenticated`);
        };
        this.sendQrRetryExceed = (data) => {
            if (!webClient)
                return logger_1.default.error("webClient not connected..");
            logger_1.default.info("sending qr exceeded");
            webClient.emit(`${data.phone}_qr_exceeded`);
        };
        this.sendConnectionClosed = (data) => {
            if (!webClient)
                return logger_1.default.error("webClient not connected..");
            webClient.emit(`${data.phone}_connection_closed`, { reason: data.reason });
        };
        this.sendError = (data) => {
            if (!webClient)
                return logger_1.default.error("webClient not connected..");
            webClient.emit(`${data.phone}_error`, { reason: data.reason });
        };
    }
    sendLoggedOut(data) {
        if (!webClient)
            return logger_1.default.error("webClient not connected..");
        logger_1.default.info("sending logout to ", data);
        webClient.emit(`${data.phone}_LOGGEDOUT`, data);
    }
    sendFailedMessageSendProgress(deviceId, progressData) {
        if (!webClient)
            return logger_1.default.error("webClient not connected..");
        logger_1.default.info("sending failed message over to ", progressData);
        webClient.emit(`${deviceId}_FAILED_PROGRESS`, progressData);
    }
    sendFailedMessageSendComplete(data) {
        if (!webClient)
            return logger_1.default.error("webClient not connected..");
        logger_1.default.info("sending failed message over to ", data);
        webClient.emit(`${data.deviceId}_FAILED_COMPLETED`, data);
    }
}
exports.SocketManager = SocketManager;
exports.default = new SocketManager();
//# sourceMappingURL=socket.js.map