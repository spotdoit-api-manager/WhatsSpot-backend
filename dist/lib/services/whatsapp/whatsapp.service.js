"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
const device_model_1 = __importDefault(require("./../../../components/device/device.model"));
const instance_provider_1 = __importDefault(require("./instance.provider"));
const logger_1 = __importDefault(require("../../../core/logger"));
const logFileName = "[WhatsappService] : ";
class Whatsapp extends events_1.EventEmitter {
    constructor(phone) {
        super();
        this.authState = false;
        this.qrInProcess = false;
        this.qrRequested = false;
        this.retryCount = 0;
        // start a connection
        this.initiClient = () => __awaiter(this, void 0, void 0, function* () {
            // if(!this.qrRequested) return;
            try {
                const sock = baileys_1.default({
                    logger: pino_1.default({ level: "info" }),
                    printQRInTerminal: false,
                    auth: this.state,
                });
                this.client = sock;
                this.startBasicEventListners();
                // await this.client.waitForSocketOpen();
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
                    ;
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
        this.sendMessageWTyping = (phone, msg, jid) => __awaiter(this, void 0, void 0, function* () {
            yield this.client.presenceSubscribe(jid);
            yield baileys_1.delay(500);
            yield this.client.sendPresenceUpdate("composing", jid);
            yield baileys_1.delay(2000);
            yield this.client.sendPresenceUpdate("paused", jid);
            yield this.client.sendMessage(jid, msg);
        });
        this.sendTextMessage = (to, msg) => __awaiter(this, void 0, void 0, function* () {
            try {
                const jid = whatsapp_utils_1.getSerializedPhone(to);
                yield this.client.presenceSubscribe(jid);
                yield baileys_1.delay(500);
                const result = yield this.client.sendMessage(jid, {
                    text: msg, detectLinks: true,
                });
                if (result.status != 1) {
                    return { error: true };
                }
                return { error: false };
            }
            catch (e) {
                logger_1.default.log(e);
                return { error: true, message: e.message };
            }
        });
        this.sendMediaMessage = (to, msg) => __awaiter(this, void 0, void 0, function* () {
            try {
                const jid = whatsapp_utils_1.getSerializedPhone(to);
                yield this.client.presenceSubscribe(jid);
                yield baileys_1.delay(500);
                logger_1.default.log("serialized phone ", jid);
                logger_1.default.log("message is ", msg);
                const msgBody = {
                    image: msg.image,
                    caption: msg.caption
                };
                const result = yield this.client.sendMessage(jid, msgBody);
                if (result.status != 1) {
                    return { error: true };
                }
                return { error: false };
            }
            catch (e) {
                logger_1.default.log(e);
                return { error: true, message: e.message };
            }
        });
        this._instanceId = instance_provider_1.default.addInstance(this);
        this.state = baileys_1.useSingleFileAuthState(`${process.env.SESSIONS_FOLDER}/${phone}_cred.json`).state;
        this.saveState = baileys_1.useSingleFileAuthState(`${process.env.SESSIONS_FOLDER}/${phone}_cred.json`).saveState;
        this.phone = phone;
    }
    checkIfQrRetryExceeded(lastDisconnect) {
        var _a, _b;
        if (lastDisconnect && ((_b = (_a = lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.payload.message) ==
            "QR refs attempts ended") {
            return true;
        }
        ;
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
                // logger.log(JSON.stringify(m, undefined, 2))
                const msg = m.messages[0];
                if (!msg.key.fromMe) {
                    logger_1.default.debug(logFileName, `received msg :${(_a = msg.message) === null || _a === void 0 ? void 0 : _a.conversation}`);
                    logger_1.default.debug(logFileName, `From: ${msg.key.remoteJid}`);
                }
                else {
                    logger_1.default.log(logFileName, `sent msg :${JSON.stringify(msg.message)}`);
                    logger_1.default.log(logFileName, `to: ${msg.key.remoteJid}`);
                }
                if (!msg.key.fromMe && m.type === "notify") {
                    // logger.log("replying to", m.messages[0].key.remoteJid);
                    // await this.client!.sendReadReceipt(
                    //   msg.key.remoteJid,
                    //   msg.key.participant,
                    //   [msg.key.id]
                    // );
                    // await this.sendMessageWTyping(this.phone, { text: 'Hello there!' }, msg.key.remoteJid)
                }
            }
            catch (err) {
                logger_1.default.error(logFileName, err);
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
                logger_1.default.warn(logFileName, `[${this.phone}] Max Connection Retry Reached....`);
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
    handleConnectionOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(logFileName, "CONNECTION_OPENED");
            this.qrRequested = true;
            this.qrInProcess = false;
            yield device_model_1.default.updateDevice(this.phone, {
                authState: true, reason: null
            });
            this.emit("authenticated", { phone: this.phone });
            return this.authState = true;
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
                yield device_model_1.default.updateDevice(this.phone, {
                    authState: false, reason
                });
                this.qrInProcess = false;
                this.qrRequested = false;
                logger_1.default.warn(logFileName, "CONNECTION_CLOSED (LOGGEDOUT)", reason, this.phone);
                this.emit("LOGGEDOUT", { phone: this.phone, reason: reason === null || reason === void 0 ? void 0 : reason.message });
            }
        });
    }
    endClient() {
        // this.client.
        this.client.end();
    }
    logoutClient() {
        this.client.logout();
    }
}
exports.default = Whatsapp;
instance_provider_1.default.addClass(Whatsapp);
// export default new Whatsapp();
//# sourceMappingURL=whatsapp.service.js.map