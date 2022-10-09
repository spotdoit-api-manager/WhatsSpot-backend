"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const whatsapp_utils_1 = require("./whatsapp-utils");
const events_1 = require("events");
const pino_1 = __importDefault(require("pino"));
const baileys_1 = __importStar(require("@adiwajshing/baileys"));
const instance_provider_1 = __importDefault(require("./instance.provider"));
const logger_1 = __importDefault(require("../../../core/logger"));
const notify_service_1 = __importDefault(require("../notify.service"));
const file_management_1 = __importDefault(require("../../../lib/helpers/file.management"));
const device_utils_1 = __importDefault(require("../../../components/device/device.utils"));
const logFileName = "[WhatsappService] : ";
const refreshInterval = 1800; //in seconds
class Whatsapp extends events_1.EventEmitter {
    constructor(deviceId, phone) {
        super();
        this.authState = false;
        this.qrInProcess = false;
        this.qrRequested = false;
        this.retryCount = 0;
        this.removed = false;
        // start a connection
        this.initiClient = () => __awaiter(this, void 0, void 0, function* () {
            // if(!this.qrRequested) return;
            try {
                const config = {
                    logger: (0, pino_1.default)({ level: "info" }),
                    printQRInTerminal: false,
                    auth: this.state,
                    browser: ["Mac OS", "Chrome", "10.15.3"],
                    downloadHistory: false,
                    // version: [2,2204,13],
                };
                const sock = (0, baileys_1.default)(config);
                this.client = sock;
                this.startBasicEventListners();
                yield this.client.waitForSocketOpen();
                return { error: false };
            }
            catch (err) {
                return { error: true, message: err.message };
            }
        });
        this.getQr = () => __awaiter(this, void 0, void 0, function* () {
            this.qrRequested = true;
            if (this.qrInProcess)
                return;
            this.qrInProcess = true;
            this.client.ev.on("connection.update", (update) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { connection, lastDisconnect, qr } = update;
                    if (connection === "connecting")
                        return;
                    if (qr) {
                        this.emit("qr", { qr: update.qr, error: false });
                        return;
                    }
                    if (this.checkIfQrRetryExceeded(lastDisconnect)) {
                        this.emit("qr", { error: true, message: "QR_RETRY_EXCEEDED" });
                        this.qrRequested = true;
                        this.qrInProcess = false;
                        this.client.ev.removeAllListeners();
                        return;
                    }
                }
                catch (err) {
                    logger_1.default.error(logFileName, err);
                }
            }));
        });
        this.sendAnyMessage = (to, msg) => __awaiter(this, void 0, void 0, function* () {
            try {
                const jid = (0, whatsapp_utils_1.getSerializedPhone)(to);
                yield this.client.presenceSubscribe(jid);
                yield (0, baileys_1.delay)(500);
                const result = yield this.client.sendMessage(jid, Object.assign(Object.assign({}, msg), { detectLinks: true }));
                logger_1.default.debug(logFileName, `Sent  Result client ${this.phone} :`, result);
                if (result.status != 1) {
                    return { error: true };
                }
                return { error: false };
            }
            catch (e) {
                logger_1.default.error(logFileName, `Sent Error client ${this.phone} :`, e);
                return { error: true, message: e.message };
            }
        });
        this._instanceId = instance_provider_1.default.addInstance(this);
        this.state = (0, baileys_1.useSingleFileAuthState)(`${process.env.SESSIONS_FOLDER}/${phone}_cred.json`).state;
        this.saveState = (0, baileys_1.useSingleFileAuthState)(`${process.env.SESSIONS_FOLDER}/${phone}_cred.json`).saveState;
        this.phone = phone;
        this.deviceId = deviceId;
        this.initRefreshInterval();
    }
    initRefreshInterval() {
        this.interval = setInterval(() => {
            logger_1.default.info(logFileName, `[${this.phone}] Refreshing Client`);
            this.getDeviceStatus();
        }, refreshInterval * 1000);
    }
    closeRefreshInterval() {
        if (this.interval) {
            logger_1.default.info(logFileName, `[${this.phone}] Closing Refresh Interval`);
            clearInterval(this.interval);
        }
    }
    checkIfQrRetryExceeded(lastDisconnect) {
        var _a, _b;
        if (lastDisconnect && ((_b = (_a = lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.payload.message) ==
            "QR refs attempts ended") {
            return true;
        }
        false;
    }
    startBasicEventListners() {
        // this.client.ev.removeAllListeners();
        //cred update listner
        this.client.ev.on("creds.update", this.saveState);
        //connection update
        this.client.ev.on("connection.update", (update) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { connection, lastDisconnect } = update;
                if (connection == "connecting")
                    return;
                if (connection === "open")
                    yield this.handleConnectionOpen();
                else if (connection === "close")
                    this.handleConnectionClose(lastDisconnect);
                else {
                    const reason = this.getDisconnectReason(lastDisconnect);
                    logger_1.default.debug(logFileName, "connection update (not open| not close)", update, reason);
                    if (update.qr) {
                        this.updateDeviceStatus(false, reason);
                    }
                    this.qrInProcess = true;
                }
            }
            catch (err) {
                logger_1.default.error(logFileName, `Error in handling connection Update ${this.phone}`, err);
            }
        }));
        // message upsert
        this.client.ev.on("messages.upsert", (m) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const msg = m.messages[0];
                if (!msg.key.fromMe) {
                    logger_1.default.info(logFileName, `received msg :${(_a = msg.message) === null || _a === void 0 ? void 0 : _a.conversation}`);
                    logger_1.default.info(logFileName, `From: ${msg.key.remoteJid}`);
                }
                else {
                    logger_1.default.info(logFileName, `sent msg :${JSON.stringify(msg.message)}`);
                    logger_1.default.info(logFileName, `to: ${msg.key.remoteJid}`);
                }
            }
            catch (err) {
                logger_1.default.error(logFileName, `Error in message upsert for client ${this.phone}`, err);
            }
        }));
    }
    isMaxRetryReached() {
        if (this.retryCount > parseInt(process.env.MAX_WHATSAPP_RETRY)) {
            this.client.ev.removeAllListeners();
            return true;
        }
        return false;
    }
    reconnectClient() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.warn("RETRYING CONNECTION..", this.phone);
            this.retryCount++;
            if (this.isMaxRetryReached()) {
                this.retryCount = 0;
                logger_1.default.warn(logFileName, `[${this.phone}] Max Connection Retry Reached....`);
                notify_service_1.default.deviceMaxRetryReached(this.deviceId);
                // this.destroyClient();
                return;
            }
            this.client.ev.removeAllListeners();
            yield this.initiClient();
        });
    }
    getDisconnectReason(lastDisconnect) {
        var _a, _b;
        let reason = null;
        if (lastDisconnect && ((_a = lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output.payload)) {
            reason = (_b = lastDisconnect.error) === null || _b === void 0 ? void 0 : _b.output.payload;
        }
        return reason;
    }
    destroyClient() {
        return;
    }
    getDeviceStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.sendPresenceUpdate("available", (0, whatsapp_utils_1.getSerializedPhone)("919099858434"));
                return { status: true };
            }
            catch (e) {
                console.log(e.message);
                if (e.message == "Connection Closed") {
                    return this.reconnectClient();
                }
                yield device_utils_1.default.updateDevice(this.deviceId, {
                    authState: false, reason: e.message
                });
                return { status: false };
            }
        });
    }
    handleConnectionOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(logFileName, "CONNECTION_OPENED");
            this.qrRequested = true;
            this.qrInProcess = false;
            this.emit("authenticated", { phone: this.phone });
            device_utils_1.default.updateDevice(this.deviceId, {
                authState: true, reason: null
            });
            notify_service_1.default.deviceAuthorized(this.deviceId);
            this.authState = true;
        });
    }
    deleteAuthFile() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authFilePath = `${process.env.SESSIONS_FOLDER}/${this.phone}_cred.json`;
                yield file_management_1.default.deleteFile(authFilePath);
            }
            catch (e) {
                logger_1.default.error(`Error in deleting auth file for ${this.phone}: `, e);
            }
        });
    }
    handleConnectionClose(lastDisconnect) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const shouldReconnect = ((_b = (_a = lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) !== baileys_1.DisconnectReason.loggedOut;
            if (shouldReconnect) {
                logger_1.default.warn(logFileName, "CONNECTION_CLOSED (NOT_LOGGED_OUT) Retrying......");
                return yield this.reconnectClient();
            }
            else {
                const reason = this.getDisconnectReason(lastDisconnect);
                this.deleteAuthFile();
                yield device_utils_1.default.updateDevice(this.deviceId, {
                    authState: false, reason
                });
                notify_service_1.default.deviceConnectionClosed(this.deviceId, reason);
                this.qrInProcess = false;
                this.qrRequested = false;
                logger_1.default.warn(logFileName, "CONNECTION_CLOSED (LOGGEDOUT)", reason, this.phone);
                this.emit("LOGGEDOUT", { phone: this.phone, reason: reason === null || reason === void 0 ? void 0 : reason.message });
                this.closeRefreshInterval();
            }
        });
    }
    updateDeviceStatus(authState, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.removed) {
                return yield device_utils_1.default.updateDevice(this.deviceId, {
                    authState, reason
                });
            }
            else {
                logger_1.default.warn(logFileName, "tried to update Device Status but device is removed", authState, reason);
            }
        });
    }
    endClient() {
        // this.client.
        this.removed = true;
        this.client.end();
    }
    logoutClient() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.logout();
                return { error: false };
            }
            catch (e) {
                return { error: true, message: e.message };
            }
        });
    }
}
exports.default = Whatsapp;
instance_provider_1.default.addClass(Whatsapp);
// export default new Whatsapp();
//# sourceMappingURL=whatsapp.service.js.map