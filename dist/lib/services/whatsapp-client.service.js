"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initateEventListners = exports.eventEmitter = void 0;
const events_1 = require("events");
const socket_1 = require("./socket");
exports.eventEmitter = new events_1.EventEmitter();
exports.initateEventListners = () => {
    console.log("initateed listners...");
    exports.eventEmitter.on('connection_update', (data) => {
        console.log("connection update ", data);
        // sendQrCode(data.phone,data.qr);
    });
    exports.eventEmitter.on('qr_update', (data) => {
        console.log("received qr data ", data);
        socket_1.sendQrCode(data.phone, data.qr);
    });
    exports.eventEmitter.on("qr_exceeded", (phone) => {
        socket_1.sendQrRetryExceed(phone);
    });
    exports.eventEmitter.on('new_client', (data) => {
        console.log("received new client data ", data);
    });
    exports.eventEmitter.on("connection_closed", (data) => {
        socket_1.sendConnectionClosed(data);
    });
    exports.eventEmitter.on("error", (data) => {
        socket_1.sendError(data);
    });
};
//# sourceMappingURL=whatsapp-client.service.js.map