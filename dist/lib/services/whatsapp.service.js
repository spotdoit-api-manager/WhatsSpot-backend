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
exports.Whatsapp = void 0;
const pino_1 = __importDefault(require("pino"));
const baileys_md_1 = __importStar(require("@adiwajshing/baileys-md"));
const whatsapp_client_service_1 = require("./whatsapp-client.service");
const clients_data_1 = __importDefault(require("../../data/clients.data"));
class Whatsapp {
    constructor() {
        // start a connection
        this.startSock = (phone, state) => {
            return new Promise((resolve) => {
                try {
                    const sock = baileys_md_1.default({
                        logger: pino_1.default({ level: "info" }),
                        printQRInTerminal: false,
                        auth: state,
                        // implement to handle retries
                        getMessage: (key) => __awaiter(this, void 0, void 0, function* () {
                            console.log("get message ", key);
                            return {
                                conversation: "hello",
                            };
                        }),
                    });
                    resolve({ sock, error: false });
                }
                catch (e) {
                    resolve({ error: true, message: e.message });
                    console.log("error catch in startsock ", e);
                }
            });
        };
        this.addClient = (phone, getQr = false) => __awaiter(this, void 0, void 0, function* () {
            const state = baileys_md_1.useSingleFileAuthState(`${phone}_cred.json`).state;
            const saveState = baileys_md_1.useSingleFileAuthState(`${phone}_cred.json`).saveState;
            const sockData = yield this.startSock(phone, state);
            if (sockData.error)
                console.log("error in creating sock ", sockData.message);
            const clientData = {
                client: sockData.sock,
                auth: false,
                phone: phone,
                saveState: saveState,
            };
            clients_data_1.default[phone] = clientData;
            this.startBasicEventListners(phone, saveState);
            if (getQr)
                yield this.getQr(phone);
            return clientData;
        });
        this.getQr = (phone) => __awaiter(this, void 0, void 0, function* () {
            let clientData = clients_data_1.default[phone];
            if (!clientData) {
                clientData = yield this.addClient(phone, false);
                console.log("client not available (get qr)");
            }
            if (clientData.auth) {
                console.log("client is already authenticated");
            }
            else {
                clientData.client.ev.on("connection.update", (update) => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    const { connection, lastDisconnect } = update;
                    if (update.qr) {
                        whatsapp_client_service_1.eventEmitter.emit("qr_update", {
                            phone: clientData.phone,
                            qr: update.qr,
                        });
                        return;
                    }
                    else if (lastDisconnect &&
                        ((_b = (_a = lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.payload.message) ==
                            "QR refs attempts ended") {
                        whatsapp_client_service_1.eventEmitter.emit("qr_exceeded", { phone: clientData.phone });
                        this.closeClient(clientData.phone);
                        this.removeClient(clientData.phone);
                        return;
                    }
                }));
            }
        });
        this.closeClient = (phone) => {
            console.log("client connection closing ", phone);
            console.log("clients are ", clients_data_1.default);
            const clientData = clients_data_1.default[phone];
            if (!clientData)
                return console.log("client not available ", phone);
            clientData.client.end();
        };
        this.removeClient = (phone) => {
            const clientData = clients_data_1.default[phone];
            console.log("removing client ", clientData.phone);
            if (clientData) {
                return delete clients_data_1.default[phone];
            }
            return console.log("client removed ", clientData.phone);
        };
        this.sendMessageWTyping = (phone, msg, jid) => __awaiter(this, void 0, void 0, function* () {
            const clientData = clients_data_1.default[phone];
            yield clientData.client.ev.presenceSubscribe(jid);
            yield baileys_md_1.delay(500);
            yield clientData.client.sendPresenceUpdate('composing', jid);
            yield baileys_md_1.delay(2000);
            yield clientData.client.sendPresenceUpdate('paused', jid);
            yield clientData.client.sendMessage(jid, msg);
        });
    }
    startBasicEventListners(phone, saveState) {
        const clientData = clients_data_1.default[phone];
        if (!clientData)
            return console.log("client not availabel (startBasicListner)");
        // console.log(`cred update for ${phone}`);
        //cred update listner
        clientData.client.ev.on("creds.update", clientData.saveState);
        //connection update
        clientData.client.ev.on("connection.update", (update) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const { connection, lastDisconnect } = update;
            console.log(update);
            if (connection === "close") {
                if (((_b = (_a = lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) !==
                    baileys_md_1.DisconnectReason.loggedOut) {
                    console.log("connection closed (not logged out)");
                    console.log((_c = lastDisconnect.error) === null || _c === void 0 ? void 0 : _c.output);
                    yield this.reconnectClient(phone);
                }
            }
            else {
                console.log("connection update ", update);
                // console.log((lastDisconnect?.error as Boom)?.output);
            }
        }));
        // message upsert 
        clientData.client.ev.on('messages.upsert', (m) => __awaiter(this, void 0, void 0, function* () {
            console.log("message upser");
            console.log(JSON.stringify(m, undefined, 2));
            const msg = m.messages[0];
            if (!msg.key.fromMe && m.type === 'notify') {
                console.log('replying to', m.messages[0].key.remoteJid);
                yield clientData.client.sendReadReceipt(msg.key.remoteJid, msg.key.participant, [msg.key.id]);
                yield this.sendMessageWTyping(clientData.phone, { text: 'Hello there!' }, msg.key.remoteJid);
            }
        }));
    }
    reconnectClient(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.addClient(phone);
        });
    }
}
exports.Whatsapp = Whatsapp;
exports.default = new Whatsapp();
//# sourceMappingURL=whatsapp.service.js.map