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
const device_interface_1 = require("./../../../components/device/device.interface");
const device_model_1 = __importDefault(require("../../../components/device/device.model"));
const message_model_1 = __importDefault(require("../../../components/messages/message.model"));
const wallet_model_1 = __importDefault(require("../../../components/walllet/wallet.model"));
const message_interface_1 = require("./../../../components/messages/message.interface");
const message_schema_1 = require("./../../../components/messages/message.schema");
const whatsapp_client_service_1 = __importDefault(require("./whatsapp-client.service"));
const socket_1 = __importDefault(require("../socket"));
const contact_model_1 = __importDefault(require("../../../components/contact/contact.model"));
const FETCH_PENDING_INTERVAL = 10;
class MessageQueueService {
    constructor() {
        this.getPendingMessagesToGroup();
    }
    getPendingMessagesToContacts(limit = 10) {
        return __awaiter(this, void 0, void 0, function* () {
            const pendingMessagesToContacts = yield message_schema_1.MessageQueue.find({ status: message_interface_1.EMessageStatus.PENDING, isGroup: false }).sort({ _id: 1 }).limit(limit);
            console.log(`FOUND ${pendingMessagesToContacts.length} PENDING MESSAGES TO CONTACT`);
            const result = yield this.sendPendingMessageToContacts(pendingMessagesToContacts);
            setTimeout(() => {
                this.getPendingMessagesToContacts();
            }, FETCH_PENDING_INTERVAL * 1000);
        });
    }
    getPendingMessagesToGroup(limit = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const pendingMessagesToGroup = yield message_schema_1.MessageQueue.find({ status: message_interface_1.EMessageStatus.PENDING, isGroup: true }).sort({ _id: 1 }).limit(limit);
            console.log(`FOUND ${pendingMessagesToGroup.length} PENDING MESSAGES TO GROUP`);
            const resultGroupContact = yield this.sendPendingMessageToGroup(pendingMessagesToGroup);
            setTimeout(() => {
                this.getPendingMessagesToGroup();
            }, FETCH_PENDING_INTERVAL * 1000);
        });
    }
    ;
    sendPendingMessageToGroup(pendingMessages) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < pendingMessages.length; i++) {
                const message = pendingMessages[i];
                const groupId = message.to;
                const userId = message.userId;
                const groupContacts = yield contact_model_1.default.fetchGroupContacts(userId, groupId);
                const walletId = (yield wallet_model_1.default.getWalletIdByUserId(message.userId));
                const contactsSent = message.contactsSent || [];
                console.log(groupContacts);
                // return;
                for (let c = 0; c < groupContacts.length; c++) {
                    const contact = groupContacts[c];
                    const idx = contactsSent.findIndex((c) => c.phoneNumber == contact.phoneNumber);
                    if (idx > -1 && contactsSent[idx].status == message_interface_1.EMessageStatus.SENT)
                        continue;
                    try {
                        const body = { to: contact.phoneNumber, message: message.message };
                        const result = yield message_model_1.default.sendTextMessage(message.userId, body, message.deviceId, walletId);
                        if (!result.error) {
                            yield message_model_1.default.updateMessageToGroupStatus(message._id, contact, message_interface_1.EMessageStatus.SENT);
                            //  await walletModel.makePaymentFromWallet(walletId,message.userId,parseFloat(process.env.TEXT_MESSAGE_RATE),`sent queue message to ${message.to} from ${message.phone}`,{deviceId:message.deviceId,to:message.to,type:EMessageStatus.PENDING});
                        }
                        else {
                            yield message_model_1.default.updateMessageToGroupStatus(message._id, contact, message_interface_1.EMessageStatus.ERROR, result.message);
                        }
                    }
                    catch (e) {
                        if (e.message == 'CLIENT_NOT_AUTHENTICATED' || e.message == 'CLIENT_NOT_FOUND') {
                            console.log("Client not authenticated.Cancelling group message sending..");
                            break;
                        }
                        console.log(e.message);
                        yield message_model_1.default.updateMessageToGroupStatus(message._id, contact, message_interface_1.EMessageStatus.ERROR, e.message);
                        continue;
                    }
                }
            }
        });
    }
    sendPendingMessageToContacts(pendingMessages) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                for (let i = 0; i < pendingMessages.length; i++) {
                    const message = pendingMessages[i];
                    try {
                        const walletId = (yield wallet_model_1.default.getWalletIdByUserId(message.userId));
                        const body = { to: message.to, message: message.message };
                        const result = yield message_model_1.default.sendTextMessage(message.userId, body, message.deviceId, walletId);
                        if (!result.error) {
                            yield message_model_1.default.updateMessageStatus(message._id, message_interface_1.EMessageStatus.SENT);
                            //  await walletModel.makePaymentFromWallet(walletId,message.userId,parseFloat(process.env.TEXT_MESSAGE_RATE),`sent queue message to ${message.to} from ${message.phone}`,{deviceId:message.deviceId,to:message.to,type:EMessageStatus.PENDING});
                        }
                        else {
                            yield message_model_1.default.updateMessageStatus(message._id, message_interface_1.EMessageStatus.ERROR, result.message);
                        }
                    }
                    catch (e) {
                        console.log(e.message);
                        yield message_model_1.default.updateMessageStatus(message._id, message_interface_1.EMessageStatus.ERROR, e.message);
                        continue;
                    }
                }
                resolve({ error: false });
            }));
        });
    }
    ;
    sendErrorMessageForDevice(errorMessages, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                yield device_model_1.default.updateDeviceStatus(deviceId, device_interface_1.EDeviceStatus.SENDING);
                for (let i = 0; i < errorMessages.length; i++) {
                    const message = errorMessages[i];
                    try {
                        const walletId = yield wallet_model_1.default.getWalletIdAndValidateTransactionAmount(message.userId, parseFloat(process.env.TEXT_MESSAGE_RATE));
                        // const result: any = await messageModel.sendTextMessage(message.userId,body,message.deviceId,walletId);
                        const result = yield whatsapp_client_service_1.default.sendTextMessage(message.phone, message.to, message.message);
                        if (!result.error) {
                            yield message_model_1.default.updateMessageStatus(message._id, message_interface_1.EMessageStatus.SENT);
                            socket_1.default.sendFailedMessageSendProgress(deviceId, { total: errorMessages.length, current: i + 1 });
                            yield wallet_model_1.default.makePaymentFromWallet(walletId, message.userId, parseFloat(process.env.TEXT_MESSAGE_RATE), `sent queue message to ${message.to} from ${message.phone}`, { deviceId: message.deviceId, to: message.to, type: message_interface_1.EMessageStatus.ERROR });
                        }
                        else {
                            socket_1.default.sendFailedMessageSendProgress(deviceId, { total: errorMessages.length, current: i + 1 });
                            yield message_model_1.default.updateMessageStatus(message._id, message_interface_1.EMessageStatus.ERROR, result.message);
                        }
                    }
                    catch (e) {
                        console.log(e);
                        yield message_model_1.default.updateMessageStatus(message._id, message_interface_1.EMessageStatus.ERROR, e.message);
                        continue;
                    }
                }
                device_model_1.default.updateDeviceStatus(deviceId, device_interface_1.EDeviceStatus.IDLE);
                resolve({ error: false });
            }));
        });
    }
}
exports.MessageQueueService = MessageQueueService;
exports.default = new MessageQueueService();
//# sourceMappingURL=message-queue.service.js.map