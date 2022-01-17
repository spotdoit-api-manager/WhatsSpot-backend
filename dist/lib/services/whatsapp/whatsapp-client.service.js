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
exports.WhatsappClient = exports.eventEmitter = void 0;
const socket_1 = __importDefault(require("./../socket"));
const events_1 = require("events");
const clients_data_1 = __importDefault(require("../../../data/clients.data"));
const whatsapp_service_1 = __importDefault(require("./whatsapp.service"));
const device_model_1 = __importDefault(require("../../../components/device/device.model"));
const message_queue_service_1 = __importDefault(require("./message-queue.service"));
exports.eventEmitter = new events_1.EventEmitter();
class WhatsappClient {
    constructor() {
        this.clients = clients_data_1.default;
        this.getClientQr = (phone) => __awaiter(this, void 0, void 0, function* () {
            this.removeQrListner(phone);
            const client = this.addClient(phone);
            client.on("qr", (qrData) => {
                console.log("got qr ", qrData.qr);
                // if (qrData.error) return;
                socket_1.default.sendQrCode(phone, qrData);
            });
            client.on("authenticated", (client) => {
                console.log("got authenticated ", client.phone);
                socket_1.default.sendAuthenticated(client.phone);
            });
            client.getQr();
        });
        this.addClient = (phone) => {
            const client = new whatsapp_service_1.default(phone);
            clients_data_1.default[phone] = client;
            return client;
        };
        this.getClient = (phone) => {
            return clients_data_1.default[phone];
        };
        this.sendTextMessage = (phone, to, message) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("sending message to ", to);
                const client = this.getClient(phone);
                if (!client)
                    return { error: true, message: "CLIENT_NOT_FOUND" };
                if (!client.authState)
                    return { error: true, message: "CLIENT_NOT_AUTHENTICATED" };
                const data = yield client.sendTextMessage(to, message);
                console.log("sent data is ", data);
                return data;
            }
            catch (e) {
                return { error: true, message: e.message };
            }
        });
        this.sendImageMessage = (phone, to, msg) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("sending image message to ", to);
                const client = this.getClient(phone);
                if (!client)
                    return { error: true, message: "CLIENT_NOT_FOUND" };
                if (!client.authState)
                    return { error: true, message: "CLIENT_NOT_AUTHENTICATED" };
                const data = yield client.sendImageMessage(to, msg);
                console.log("image sent data is ", data);
                return data;
            }
            catch (e) {
                return { error: true, message: e.message };
            }
        });
    }
    removeQrListner(phone) {
        try {
            if (clients_data_1.default[phone]) {
                clients_data_1.default[phone].endClient();
                clients_data_1.default[phone] = null;
            }
        }
        catch (err) {
            console.log("error in client end ", err);
        }
    }
    logoutClient(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                clients_data_1.default[phone].logoutClient();
                return { error: false };
            }
            catch (e) {
                return { error: true, message: e.message };
            }
        });
    }
    initializeAllClients() {
        return __awaiter(this, void 0, void 0, function* () {
            console.info("INITIALIZING ALL CLIENTS...");
            const condition = { authState: true };
            const devices = yield device_model_1.default.findDeviceByCondition(condition);
            console.info("Total Clients to Initialize: ", devices.length);
            for (let i = 0; i < devices.length; i++) {
                const device = devices[i];
                console.log(`client${i}:${device.phone}`);
                this.addClient(device.phone);
            }
            message_queue_service_1.default.getPendingsMessages();
            console.log("STARTED_MESSAGE_QUEUE_SERVICE...");
        });
    }
}
exports.WhatsappClient = WhatsappClient;
exports.default = new WhatsappClient();
//# sourceMappingURL=whatsapp-client.service.js.map