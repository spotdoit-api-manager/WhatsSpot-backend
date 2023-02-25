"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const pino_1 = __importDefault(require("pino"));
const instance_provider_old_1 = __importDefault(require("./instance.provider.old"));
const logFileName = "[WhatsappService] : ";
const refreshInterval = 1800; //in seconds
class WhatsappOld extends events_1.EventEmitter {
    // private interval;
    constructor(deviceId, phone) {
        super();
        this.logger = (0, pino_1.default)({});
        this.authState = false;
        this.qrInProcess = false;
        this.qrRequested = false;
        this.retryCount = 0;
        this.removed = false;
        this.firstConnect = false;
        this.logger.level = "trace";
        console.log(".............................................OLD WHATSAPPPPP--------------------------");
        this._instanceId = instance_provider_old_1.default.addInstance(this);
        // this.state = useSingleFileAuthState(`${process.env.SESSIONS_FOLDER}/s/${phone}_cred.json`).state;
        // this.saveState = useSingleFileAuthState(`${process.env.SESSIONS_FOLDER}/${phone}_cred.json`).saveState;
        this.phone = phone;
        this.deviceId = deviceId;
        //     this.initRefreshInterval();
    }
}
exports.default = WhatsappOld;
instance_provider_old_1.default.addClass(WhatsappOld);
// export default new Whatsapp();
//# sourceMappingURL=whatsapp.service.old.js.map