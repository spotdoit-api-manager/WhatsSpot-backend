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
const events_1 = require("events");
const pino_1 = __importDefault(require("pino"));
const baileys_md_1 = __importStar(require("@adiwajshing/baileys-md"));
const clients_data_1 = __importDefault(require("../../data/clients.data"));
const client_model_1 = __importDefault(require("../../components/client/client.model"));
// export  declare interface Whatsapp {
//   on(event: 'qr', listener: (name: string) => void): this;
//   // on(event: string, listener: Function): this;
// }
class Whatsapp extends events_1.EventEmitter {
    constructor(phone) {
        super();
        this.authState = false;
        this.qr = new events_1.EventEmitter();
        // start a connection
        this.startSock = () => {
            const sock = baileys_md_1.default({
                logger: pino_1.default({ level: "info" }),
                printQRInTerminal: false,
                auth: this.state,
                // implement to handle retries
                getMessage: (key) => __awaiter(this, void 0, void 0, function* () {
                    console.log("get message ", key);
                    return {
                        conversation: "hello",
                    };
                }),
            });
            return sock;
        };
        this.getQr = () => __awaiter(this, void 0, void 0, function* () {
            this.client.ev.on("connection.update", (update) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c;
                console.log("connection update (getQr) ", update);
                const { connection, lastDisconnect } = update;
                console.log("connection update (getQr) ", (_a = lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output);
                if (connection === "connecting")
                    return;
                if (update.qr) {
                    this.emit("qr", { qr: update.qr, error: false });
                    return;
                }
                else if (lastDisconnect &&
                    ((_c = (_b = lastDisconnect.error) === null || _b === void 0 ? void 0 : _b.output) === null || _c === void 0 ? void 0 : _c.payload.message) ==
                        "QR refs attempts ended") {
                    this.client.ev.removeAllListeners();
                    this.emit("qr", { error: true, message: "qr retry exceeded" });
                    return;
                }
            }));
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
            yield this.client.presenceSubscribe(jid);
            yield baileys_md_1.delay(500);
            yield this.client.sendPresenceUpdate('composing', jid);
            yield baileys_md_1.delay(2000);
            yield this.client.sendPresenceUpdate('paused', jid);
            yield this.client.sendMessage(jid, msg);
        });
        this.state = baileys_md_1.useSingleFileAuthState(`${phone}_cred.json`).state;
        this.saveState = baileys_md_1.useSingleFileAuthState(`${phone}_cred.json`).saveState;
        this.client = this.startSock();
        this.startBasicEventListners();
    }
    startBasicEventListners() {
        //cred update listner
        this.client.ev.on("creds.update", this.saveState);
        //connection update
        this.client.ev.on("connection.update", (update) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const { connection, lastDisconnect } = update;
            if (connection === 'open') {
                this.emit("authenticated");
                const data = client_model_1.default.addOrUpdateClient(this.phone, { authState: true });
                return this.authState = true;
            }
            if (connection === "close") {
                const data = client_model_1.default.addOrUpdateClient(this.phone, { authState: false });
                if (((_b = (_a = lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) !==
                    baileys_md_1.DisconnectReason.loggedOut) {
                    console.log("connection closed (not logged out)");
                    console.log((_c = lastDisconnect.error) === null || _c === void 0 ? void 0 : _c.output);
                    yield this.reconnectClient();
                }
            }
            else {
                console.log("connection update (basic listners)", update);
            }
        }));
        // message upsert 
        this.client.ev.on('messages.upsert', (m) => __awaiter(this, void 0, void 0, function* () {
            console.log("message upser");
            // console.log(JSON.stringify(m, undefined, 2))
            const msg = m.messages[0];
            if (!msg.key.fromMe && m.type === 'notify') {
                console.log('replying to', m.messages[0].key.remoteJid);
                yield this.client.sendReadReceipt(msg.key.remoteJid, msg.key.participant, [msg.key.id]);
                // await this.sendMessageWTyping(this.phone, { text: 'Hello there!' }, msg.key.remoteJid)
            }
        }));
    }
    reconnectClient() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("RETRYING CONNECTION..");
            this.client = this.startSock();
            this.startBasicEventListners();
        });
    }
}
exports.default = Whatsapp;
// export default new Whatsapp();
//# sourceMappingURL=whatsapp.service.js.map