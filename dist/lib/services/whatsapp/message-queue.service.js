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
const message_schema_1 = require("./../../../components/messages/message.schema");
const whatsapp_client_service_1 = __importDefault(require("./whatsapp-client.service"));
const FETCH_PENDING_INTERVAL = 10;
class MessageQueueService {
    constructor() {
        this.updateMessage = (id) => __awaiter(this, void 0, void 0, function* () {
            yield message_schema_1.MessageQueue.updateOne({ _id: id }, { status: 'sent' });
        });
    }
    getPendingsMessages(limit = 10) {
        return __awaiter(this, void 0, void 0, function* () {
            const pendingMessages = yield message_schema_1.MessageQueue.find({ status: "pending" }).sort({ _id: 1 }).limit(limit);
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
                        whatsapp_client_service_1.default.sendTextMessage(message.phone, message.to, message.message);
                        yield this.updateMessage(message._id);
                    }
                    catch (e) {
                        console.log(e);
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