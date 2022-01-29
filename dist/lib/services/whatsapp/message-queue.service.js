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
exports.MessageQueueService = void 0;
const wallet_model_1 = __importDefault(require("../../../components/walllet/wallet.model"));
const message_interface_1 = require("./../../../components/messages/message.interface");
const message_schema_1 = require("./../../../components/messages/message.schema");
const whatsapp_client_service_1 = __importDefault(require("./whatsapp-client.service"));
const FETCH_PENDING_INTERVAL = 10;
class MessageQueueService {
    constructor() {
        this.updateMessageStatus = (id, status, reason = null) => __awaiter(this, void 0, void 0, function* () {
            yield message_schema_1.MessageQueue.updateOne({ _id: id }, { status: status, reason: reason });
        });
    }
    getPendingsMessages(limit = 10) {
        return __awaiter(this, void 0, void 0, function* () {
            const pendingMessages = yield message_schema_1.MessageQueue.find({ status: message_interface_1.EMessageStatus.PENDING }).sort({ _id: 1 }).limit(limit);
            console.log(`FOUND ${pendingMessages.length} PENDING MESSAGES`);
            const data = yield this.sendPendingMessage(pendingMessages);
            setTimeout(() => {
                this.getPendingsMessages();
            }, FETCH_PENDING_INTERVAL * 1000);
        });
    }
    sendPendingMessage(pendingMessages) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                for (let i = 0; i < pendingMessages.length; i++) {
                    const message = pendingMessages[i];
                    try {
                        const walletId = yield wallet_model_1.default.getWalletIdAndValidateTransactionAmount(message.userId, parseFloat(process.env.TEXT_MESSAGE_RATE));
                        const result = yield whatsapp_client_service_1.default.sendTextMessage(message.phone, message.to, message.message);
                        if (!result.error) {
                            yield this.updateMessageStatus(message._id, message_interface_1.EMessageStatus.SENT);
                            yield wallet_model_1.default.makePaymentFromWallet(walletId, message.userId, parseFloat(process.env.TEXT_MESSAGE_RATE), `sent queue message to ${message.to} from ${message.phone}`, { deviceId: message.deviceId, to: message.to });
                        }
                        else {
                            yield this.updateMessageStatus(message._id, message_interface_1.EMessageStatus.ERROR, result.message);
                        }
                    }
                    catch (e) {
                        console.log(e);
                        yield this.updateMessageStatus(message._id, message_interface_1.EMessageStatus.ERROR, e.message);
                        continue;
                    }
                }
                resolve({ error: false });
            }));
        });
    }
}
exports.MessageQueueService = MessageQueueService;
exports.default = new MessageQueueService();
//# sourceMappingURL=message-queue.service.js.map