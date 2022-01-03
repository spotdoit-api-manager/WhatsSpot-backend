"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initateEventListners = exports.WhatsappClient = exports.eventEmitter = void 0;
const events_1 = require("events");
const socket_1 = require("./socket");
const clients_data_1 = __importDefault(require("../../data/clients.data"));
const whatsapp_service_1 = __importDefault(require("./whatsapp.service"));
exports.eventEmitter = new events_1.EventEmitter();
class WhatsappClient {
    constructor() {
        this.getQr = (phone) => {
            const client = new whatsapp_service_1.default(phone);
            const clientData = {
                phone: phone,
                authState: client.authState,
                reason: ""
            };
            clients_data_1.default[phone] = client;
            client.on("qr", (qrData) => {
                console.log("got qr ", qrData.qr);
                if (qrData.error)
                    return;
                socket_1.sendQrCode(phone, qrData.qr);
            });
            client.getQr();
        };
        this.addClient = (clientData) => {
            clients_data_1.default[clientData.phone] = clientData;
        };
    }
}
exports.WhatsappClient = WhatsappClient;
exports.default = new WhatsappClient();
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