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
const message_interface_1 = require("./../../../components/messages/message.interface");
const socket_1 = __importDefault(require("./../socket"));
const events_1 = require("events");
const clients_data_1 = __importDefault(require("../../../data/clients.data"));
const whatsapp_service_1 = __importDefault(require("./whatsapp.service"));
const utils_1 = require("../../../lib/utils");
const instance_provider_1 = __importDefault(require("./instance.provider"));
const logger_1 = __importDefault(require("../../../core/logger"));
const httpErrors_1 = require("../../../lib/utils/httpErrors");
const device_utils_1 = __importDefault(require("../../../components/device/device.utils"));
const whatsapp_enum_1 = require("./whatsapp.enum");
const axios_1 = __importDefault(require("axios"));
const wallet_model_1 = __importDefault(require("../../../components/wallet/wallet.model"));
const plan_manager_service_1 = __importDefault(require("../plan.manager.service"));
const plans_model_1 = __importDefault(require("../../../components/plans/plans.model"));
const webhooks_model_1 = __importDefault(require("../../../components/webhooks/webhooks.model"));
const file_management_1 = __importDefault(require("../../../lib/helpers/file.management"));
const moment_1 = __importDefault(require("moment"));
const user_model_1 = __importDefault(require("../../../components/user/user.model"));
const logFileName = "[WhatsappClientService] : ";
exports.eventEmitter = new events_1.EventEmitter();
class WhatsappClient {
    constructor() {
        this.clients = clients_data_1.default;
        this.addClient = (deviceId, phone) => __awaiter(this, void 0, void 0, function* () {
            // const check if session folder contains phon_cred.json
            const clientInstance = new whatsapp_service_1.default(deviceId, phone);
            const instaceId = instance_provider_1.default.getInstanceId(clientInstance);
            logger_1.default.info(logFileName, `Adding client ${phone}`);
            clients_data_1.default[phone] = instaceId;
            console.info(logFileName, `Number of instance present = ${Object.keys(this.clients).length}`);
            return clientInstance;
        });
        this.getClientInstanceByInstanceId = (instanceId) => {
            try {
                const instance = instance_provider_1.default.getClassInstance(whatsapp_service_1.default, instanceId);
                return instance;
            }
            catch (e) {
                console.error(e);
                throw new Error("CLIENT_NOT_AUTHENTICATED");
            }
        };
        this.getClientQr = (deviceId, phone) => __awaiter(this, void 0, void 0, function* () {
            this.removeClientInstanceByPhone(phone);
            const client = yield this.addClient(deviceId, phone);
            client.on("qr", (qrData) => {
                console.debug(logFileName, "got qr ", qrData.qr);
                socket_1.default.sendQrCode(phone, qrData);
            });
            client.on("authenticated", (client) => {
                console.debug(logFileName, "got authenticated ", client.phone);
                socket_1.default.sendAuthenticated(client.phone);
            });
            const result = yield client.initiClient();
            if (result.error)
                return result;
            client.getQr();
        });
        this.sendTextMessage = (from, to, message) => __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info(logFileName, `Sending Text Message to ${to} | from: ${from}`);
                const clientInstance = this.getClientInstanceByPhone(from);
                if (!clientInstance) {
                    logger_1.default.error(logFileName, `Client not found ${from}`);
                    return { error: true, message: "CLIENT_NOT_FOUND" };
                }
                if (!clientInstance.authState) {
                    logger_1.default.error(logFileName, `Client not authenticated ${from}`);
                    return { error: true, message: "CLIENT_NOT_AUTHENTICATED" };
                }
                const data = yield clientInstance.sendAnyMessage((0, utils_1.sanatizeMobile)(to), message);
                return data;
            }
            catch (e) {
                return { error: true, message: e.message };
            }
        });
        this.sendListMessage = (from, to, message) => __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info(logFileName, `Sending List Message to ${to}`);
                const clientInstance = this.getClientInstanceByPhone(from);
                if (!clientInstance)
                    return { error: true, message: "CLIENT_NOT_AUTHENTICATED" };
                if (!clientInstance.authState)
                    return { error: true, message: "CLIENT_NOT_AUTHENTICATED" };
                const data = yield clientInstance.sendAnyMessage((0, utils_1.sanatizeMobile)(to), message);
                return data;
            }
            catch (e) {
                return { error: true, message: e.message };
            }
        });
        this.sendButtonMessage = (from, to, message) => __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info(logFileName, `Sending Button Message to ${to}`);
                const clientInstance = this.getClientInstanceByPhone(from);
                if (!clientInstance)
                    return { error: true, message: "CLIENT_NOT_AUTHENTICATED" };
                if (!clientInstance.authState)
                    return { error: true, message: "CLIENT_NOT_AUTHENTICATED" };
                const data = yield clientInstance.sendAnyMessage((0, utils_1.sanatizeMobile)(to), message);
                return data;
            }
            catch (e) {
                return { error: true, message: e.message };
            }
        });
        this.sendTemplateMessage = (from, to, message) => __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info(logFileName, `Sending Template Message to ${to}`);
                const clientInstance = this.getClientInstanceByPhone(from);
                if (!clientInstance)
                    return { error: true, message: "CLIENT_NOT_AUTHENTICATED" };
                if (!clientInstance.authState)
                    return { error: true, message: "CLIENT_NOT_AUTHENTICATED" };
                const data = yield clientInstance.sendAnyMessage((0, utils_1.sanatizeMobile)(to), message);
                return data;
            }
            catch (e) {
                return { error: true, message: e.message };
            }
        });
        this.sendImageButtonMessage = (from, to, message) => __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info(logFileName, `Sending Template Message to ${to}`);
                const clientInstance = this.getClientInstanceByPhone(from);
                if (!clientInstance)
                    return { error: true, message: "CLIENT_NOT_AUTHENTICATED" };
                if (!clientInstance.authState)
                    return { error: true, message: "CLIENT_NOT_AUTHENTICATED" };
                console.log(message);
                const data = yield clientInstance.sendAnyMessage((0, utils_1.sanatizeMobile)(to), message);
                return data;
            }
            catch (e) {
                return { error: true, message: e.message };
            }
        });
        this.sendImageTemplateMessage = (from, to, message) => __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info(logFileName, `Sending Image Template Message to ${to}`);
                const clientInstance = this.getClientInstanceByPhone(from);
                if (!clientInstance)
                    return { error: true, message: "CLIENT_NOT_AUTHENTICATED" };
                if (!clientInstance.authState)
                    return { error: true, message: "CLIENT_NOT_AUTHENTICATED" };
                console.log(message);
                const data = yield clientInstance.sendAnyMessage((0, utils_1.sanatizeMobile)(to), message);
                return data;
            }
            catch (e) {
                return { error: true, message: e.message };
            }
        });
        this.sendImageMessage = (phone, to, msg) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.debug(logFileName, "sending image message to ", to);
                const client = this.getClientInstanceByPhone(phone);
                if (!client)
                    return { error: true, message: "CLIENT_NOT_AUTHENTICATED" };
                if (!client.authState)
                    return { error: true, message: "CLIENT_NOT_AUTHENTICATED" };
                const data = yield client.sendAnyMessage(to, msg);
                console.log("image sent data is ", data);
                return data;
            }
            catch (e) {
                return { error: true, message: e.message };
            }
        });
    }
    getClientStatus(phone) {
        const client = this.getClientInstanceByPhone(phone);
        if (!client)
            return { error: false, message: "CLIENT_NOT_AUTHENTICATED" };
        return client.getDeviceStatus();
    }
    getClientInstanceByPhone(phone) {
        return this.getClientInstanceByInstanceId(this.clients[phone]);
    }
    logoutClient(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = this.getClientInstanceByPhone(phone);
                if (!client)
                    return { error: false, message: "CLIENT_NOT_AUTHENTICATED" };
                const result = yield client.logoutClient();
                if (result.error)
                    throw new httpErrors_1.HTTP400Error(result.message);
                client.on("LOGGED_OUT", (data) => {
                    socket_1.default.sendLoggedOut(data);
                });
                return { error: false };
            }
            catch (e) {
                return { error: true, message: e.message };
            }
        });
    }
    removeClientInstanceByPhone(phone) {
        console.debug(logFileName, `Removing client ${phone}`);
        const instanceId = this.clients[phone];
        if (!instanceId)
            return { error: true, message: "INSTANCE_NOT_FOUND" };
        delete this.clients[phone];
        return this.removeClientByInstanceId(instanceId);
    }
    removeClientByInstanceId(instanceId) {
        try {
            console.debug(logFileName, `Removing client ${instanceId}`);
            let instance = instance_provider_1.default.getClassInstance(whatsapp_service_1.default, instanceId);
            instance.endClient();
            instance_provider_1.default.removeClassInstance(whatsapp_service_1.default, instanceId);
            instance = null;
            return { error: false, message: "client removed" };
        }
        catch (err) {
            console.error(logFileName, "error in client end ", err);
            return { error: true, message: err.message };
        }
    }
    sendRawMessage(phone, to, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info(logFileName, `Sending Raw Message to ${to}`);
                const clientInstance = this.getClientInstanceByPhone(phone);
                if (!clientInstance)
                    return { error: true, message: "CLIENT_NOT_AUTHENTICATED" };
                if (!clientInstance.authState)
                    return { error: true, message: "CLIENT_NOT_AUTHENTICATED" };
                const data = yield clientInstance.sendAnyMessage((0, utils_1.sanatizeMobile)(to), message);
                return data;
            }
            catch (e) {
                return { error: true, message: e.message };
            }
        });
    }
    sendTypeMessage(messageType, message, from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("message type ", messageType);
            switch (messageType) {
                case whatsapp_enum_1.EWhatsappMessageTypes.TEXT_MESSAGE:
                    return yield this.sendTextMessage(from, to, message);
                case whatsapp_enum_1.EWhatsappMessageTypes.LIST_MESSAGE:
                    return yield this.sendListMessage(from, to, message);
                case whatsapp_enum_1.EWhatsappMessageTypes.BUTTON_MESSAGE:
                    return yield this.sendButtonMessage(from, to, message);
                case whatsapp_enum_1.EWhatsappMessageTypes.TEMPLATE_MESSAGE:
                    return yield this.sendTemplateMessage(from, to, message);
                case whatsapp_enum_1.EWhatsappMessageTypes.IMAGE_BUTTON_MESSAGE:
                    return yield this.sendImageButtonMessage(from, to, message);
                case whatsapp_enum_1.EWhatsappMessageTypes.IMAGE_TEMPLATE_MESSAGE:
                    return yield this.sendImageTemplateMessage(from, to, message);
                default:
                    return { error: true, message: "INVALID_MESSAGE_TYPE" };
            }
        });
    }
    initializeAllClients() {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.env.RECONNECT_CLIENT === "true") {
                logger_1.default.info(logFileName, "INITIALIZING ALL CLIENTS...");
                const condition = { authState: true };
                const devices = yield device_utils_1.default.findDeviceByCondition(condition);
                logger_1.default.info(logFileName, "Total Clients to Initialize: ", devices.length);
                for (let i = 0; i < devices.length; i++) {
                    try {
                        const device = devices[i];
                        const walletId = yield wallet_model_1.default.getWalletIdByUserId(device.userId);
                        console.debug(logFileName, `client${i}:${device.phone}`);
                        const client = yield this.addClient(device._id, device.phone);
                        yield client.initiClient(false);
                        // filter active webhooks from device and subscribe to client for each
                        const activeWebHooks = device.webHooks.filter((webHook) => webHook.status);
                        if (activeWebHooks.length >= 0) {
                            this.subscribeClientMessage(device.userId, walletId, client, activeWebHooks);
                        }
                    }
                    catch (e) {
                        logger_1.default.error(logFileName, "Error in initializing client", e);
                    }
                }
            }
            else {
                logger_1.default.warn(logFileName, "Client initialization is disabled");
            }
        });
    }
    subscribeNewWebHook(userId, walletId, webHook, phone) {
        const client = this.getClientInstanceByPhone(phone);
        if (client) {
            this.subscribeClientMessage(userId, walletId, client, [webHook]);
        }
    }
    unsubscribeWebHook(userId, walletId, webHooks, phone) {
        const client = this.getClientInstanceByPhone(phone);
        // unsubscribe NEW_MESSAGE event from client
        if (client) {
            // unsubscribe to event NEW_MESSAGE
            client.removeAllListeners("NEW_MESSAGE");
            // client.off("NEW_MESSAGE");
            // subscribe to client for remaining webhooks
            if (webHooks.length > 0) {
                this.subscribeClientMessage(userId, walletId, client, webHooks);
            }
        }
    }
    subscribeClientMessage(userId, walletId, client, webHooks) {
        logger_1.default.info(logFileName, "Subscribing to client message " + client.phone);
        client.on("NEW_MESSAGE", (msg) => {
            // console.log("message received in subscribe", msg);
            const urls = webHooks.map((webHook) => webHook.url);
            const body = this.whatsAppToWebHookMessage(client.deviceId, msg, urls);
            // extract url of webhook having isDeleted false and status true
            webHooks = webHooks.filter((webHook) => webHook.status && !webHook.isDeleted);
            if (webHooks.length === 0) {
                return this.unsubscribeWebHook(userId, walletId, webHooks, client.phone);
            }
            this.sendWebHookRequest(userId, walletId, client.deviceId, client.phone, webHooks, body);
        });
    }
    sendWebHookRequest(userId, walletId, deviceId, phone, webHooks, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const totalAmount = webHooks.length * parseFloat(process.env.WEBHOOK_REQUEST_RATE || "0.2");
            const urls = webHooks.map((webHook) => webHook.url);
            const { hasActivePlan, isMessageOver, activePlanInfo } = yield plan_manager_service_1.default.hasActivePlan(userId);
            const user = yield user_model_1.default.getUserById(userId);
            const totalDays = (0, moment_1.default)().diff((0, moment_1.default)(user.createdAt), "days");
            if (!hasActivePlan && totalDays > 7) {
                //   pause webhooks if no active plan or plan limit is over
                console.log("Webhook paused for device: ", deviceId, " due to NO_ACTIVE_PLAN", urls);
                this.unsubscribeWebHook(userId, walletId, webHooks, phone);
                const device = yield device_utils_1.default.findDeviceById(userId, deviceId);
                device.webHooks = device.webHooks.map((webHook) => {
                    if (webHook.url === urls[0]) {
                        webHook.status = false;
                        webHook.reason = "NO_ACTIVE_PLAN";
                    }
                    return webHook;
                });
                yield device.save();
                return;
            }
            const req = [];
            for (let i = 0; i < urls.length; i++) {
                const url = urls[i];
                req.push(axios_1.default.post(url, body));
            }
            axios_1.default.all(req).then(axios_1.default.spread((...responses) => {
                const res = responses.map((response) => response.data);
                // get count of success response
                const successCount = res.filter((r) => r.error === false).length;
                console.log("Webhook send successfully to :", urls, " successCount: ", successCount);
                plans_model_1.default.increamentWebhookMessageCount(activePlanInfo._id);
                webhooks_model_1.default.createWebhookMessage(userId, body, message_interface_1.EMessageStatus.SENT);
                return { error: false, creditUsed: 0, message: urls };
            })).catch(errors => {
                console.log("webhook request error: ", errors);
                webhooks_model_1.default.createWebhookMessage(userId, body, message_interface_1.EMessageStatus.ERROR);
            });
        });
    }
    whatsAppToWebHookMessage(deviceId, message, urls) {
        var _a, _b, _c;
        const body = {
            message: ((_a = message.message) === null || _a === void 0 ? void 0 : _a.conversation) || ((_c = (_b = message.message) === null || _b === void 0 ? void 0 : _b.extendedTextMessage) === null || _c === void 0 ? void 0 : _c.text),
            from: message.key.remoteJid.split("@")[0],
            name: message.pushName,
            timestamp: message.messageTimestamp,
            deviceId,
            urls
        };
        return body;
    }
    checkIfOldSessionPresent(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            const authFilePath = `${process.env.SESSIONS_FOLDER}/${phone}_cred.json`;
            const isPresent = yield file_management_1.default.isFilePresent(authFilePath);
            return isPresent;
        });
    }
}
exports.WhatsappClient = WhatsappClient;
exports.default = new WhatsappClient();
//# sourceMappingURL=whatsapp-client.service.js.map