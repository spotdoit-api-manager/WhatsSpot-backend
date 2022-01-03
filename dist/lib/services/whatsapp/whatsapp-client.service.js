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
const events_1 = require("events");
const socket_1 = require("../socket");
const clients_data_1 = __importDefault(require("../../../data/clients.data"));
const whatsapp_service_1 = __importDefault(require("./whatsapp.service"));
const device_model_1 = __importDefault(require("../../../components/device/device.model"));
exports.eventEmitter = new events_1.EventEmitter();
class WhatsappClient {
    constructor() {
        this.getQr = (phone) => {
            const client = new whatsapp_service_1.default(phone);
            clients_data_1.default[phone] = client;
            client.on("qr", (qrData) => {
                console.log("got qr ", qrData.qr);
                if (qrData.error)
                    return;
                socket_1.sendQrCode(phone, qrData.qr);
            });
            client.on("authenticated", (client) => {
                console.log("got authenticated ", client.phone);
                socket_1.sendAuthenticated(client.phone);
            });
            client.getQr();
        };
        this.addClient = (phone) => {
            const client = new whatsapp_service_1.default(phone);
            clients_data_1.default[phone] = client;
        };
    }
    initializeAllClients() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("INITIALIZING ALL CLIENTS...");
            const condition = { authState: true };
            const devices = yield device_model_1.default.findDeviceByCondition(condition);
            console.log("Total Clients to Initialize: ", devices.length);
            for (let i = 0; i < devices.length; i++) {
                const device = devices[i];
                console.log(`client${i}:${device.phone}`);
                this.addClient(device.phone);
            }
        });
    }
}
exports.WhatsappClient = WhatsappClient;
exports.default = new WhatsappClient();
//# sourceMappingURL=whatsapp-client.service.js.map