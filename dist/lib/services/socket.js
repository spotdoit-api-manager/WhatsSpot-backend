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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendConnectionClosed = exports.sendQrRetryExceed = exports.sendQrCode = exports.sendClientError = exports.socketServer = void 0;
const whatsapp_client_service_1 = require("./whatsapp-client.service");
const config_1 = require("../../config");
let webClient;
exports.socketServer = (server) => __awaiter(void 0, void 0, void 0, function* () {
    const io = require("socket.io")(server, {
        cors: true,
        origin: config_1.configCors.allowOrigin,
    });
    whatsapp_client_service_1.initateEventListners();
    io.on("connection", (socket) => {
        console.log("socket connected ");
        console.log(socket.id);
        webClient = socket;
        let task;
    });
});
exports.sendClientError = (phone, error) => {
    if (!webClient)
        return console.log("webClient not connected..");
    webClient.emit(`${phone}_clientError`, { reason: error });
};
exports.sendQrCode = (phone, qr) => {
    if (!webClient)
        return console.log("webClient not connected..");
    webClient.emit(`${phone}_qr`, { qr });
};
exports.sendQrRetryExceed = (data) => {
    if (!webClient)
        return console.log("webClient not connected..");
    console.log("sending qr excedded");
    webClient.emit(`${data.phone}_qr_exceeded`);
};
exports.sendConnectionClosed = (data) => {
    if (!webClient)
        return console.log("webClient not connected..");
    webClient.emit(`${data.phone}_connection_closed`, { reason: data.reason });
};
exports.sendError = (data) => {
    if (!webClient)
        return console.log("webClient not connected..");
    webClient.emit(`${data.phone}_error`, { reason: data.reason });
};
//# sourceMappingURL=socket.js.map