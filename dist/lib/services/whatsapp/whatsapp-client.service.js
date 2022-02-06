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
const utils_1 = require("../../../lib/utils");
const instance_provider_1 = __importDefault(require("./instance.provider"));
exports.eventEmitter = new events_1.EventEmitter();
class WhatsappClient {
    constructor() {
        this.clients = clients_data_1.default;
        this.addClient = (phone) => {
            const clientInstance = new whatsapp_service_1.default(phone);
            const instaceId = instance_provider_1.default.getInstanceId(clientInstance);
            clients_data_1.default[phone] = instaceId;
            console.log(`Number of instance present = ${Object.keys(this.clients).length}`);
            return clientInstance;
        };
        this.getClientInstanceByInstanceId = (instanceId) => {
            return instance_provider_1.default.getClassInstance(whatsapp_service_1.default, instanceId);
        };
        this.getClientQr = (phone) => __awaiter(this, void 0, void 0, function* () {
            this.removeClientInstanceByPhone(phone);
            const client = this.addClient(phone);
            client.on("qr", (qrData) => {
                console.log("got qr ", qrData.qr);
                socket_1.default.sendQrCode(phone, qrData);
            });
            client.on("authenticated", (client) => {
                console.log("got authenticated ", client.phone);
                socket_1.default.sendAuthenticated(client.phone);
            });
            const result = yield client.initiClient();
            if (result.error)
                return result;
            client.getQr();
        });
        this.sendTextMessage = (phone, to, message) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("sending message to ", to);
                const clientInstance = this.getClientInstanceByPhone(phone);
                if (!clientInstance)
                    return { error: true, message: "CLIENT_NOT_FOUND" };
                if (!clientInstance.authState)
                    return { error: true, message: "CLIENT_NOT_AUTHENTICATED" };
                const data = yield clientInstance.sendTextMessage(utils_1.sanatizeMobile(to), message);
                return data;
            }
            catch (e) {
                return { error: true, message: e.message };
            }
        });
        this.sendImageMessage = (phone, to, msg) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("sending image message to ", to);
                const client = this.getClientInstanceByPhone(phone);
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
    getClientInstanceByPhone(phone) {
        return this.getClientInstanceByInstanceId(this.clients[phone]);
    }
    logoutClient(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = this.getClientInstanceByPhone(phone);
                client.logoutClient();
                client.on('LOGGEDOUT', (data) => {
                    console.log("logout listner ", data);
                    socket_1.default.sendLoggedout(data);
                });
                return { error: false };
            }
            catch (e) {
                return { error: true, message: e.message };
            }
        });
    }
    removeClientInstanceByPhone(phone) {
        console.log(`Removing client ${phone}`);
        const instanceId = this.clients[phone];
        if (!instanceId)
            return { error: true, message: "INSTANCE_NOT_FOUND" };
        delete this.clients[phone];
        return this.removeClientByInstanceId(instanceId);
    }
    removeClientByInstanceId(instanceId) {
        try {
            console.log(`Removing client instance ${instanceId}`);
            let instance = instance_provider_1.default.getClassInstance(whatsapp_service_1.default, instanceId);
            instance.endClient();
            instance_provider_1.default.removeClassInstance(whatsapp_service_1.default, instanceId);
            instance = null;
            return { error: false, message: "client removed" };
        }
        catch (err) {
            console.log("error in client end ", err);
            return { error: true, message: err.message };
        }
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
                const client = this.addClient(device.phone);
                yield client.initiClient();
            }
            setTimeout(() => {
                console.log("STARTED_MESSAGE_QUEUE_SERVICE...");
                message_queue_service_1.default.getPendingsMessages();
            }, 10000);
        });
    }
}
exports.WhatsappClient = WhatsappClient;
exports.default = new WhatsappClient();
//# sourceMappingURL=whatsapp-client.service.js.map