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
exports.MessageModel = void 0;
const bson_1 = require("bson");
const index_1 = require("./../../lib/utils/index");
const utils_1 = require("../../lib/utils");
const httpErrors_1 = require("../../lib/utils/httpErrors");
const device_model_1 = __importDefault(require("../device/device.model"));
const message_interface_1 = require("./message.interface");
const message_schema_1 = require("./message.schema");
const whatsapp_client_service_1 = __importDefault(require("../../lib/services/whatsapp/whatsapp-client.service"));
const wallet_model_1 = __importDefault(require("../walllet/wallet.model"));
const message_queue_service_1 = __importDefault(require("../../lib/services/whatsapp/message-queue.service"));
class MessageModel {
    constructor() {
        this.updateMessageStatus = (id, status, reason = null) => __awaiter(this, void 0, void 0, function* () {
            yield message_schema_1.MessageQueue.updateOne({ _id: id }, { status: status, reason: reason });
        });
    }
    retryFailedMessage(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = yield message_schema_1.MessageQueue.find({ userId: new bson_1.ObjectID(userId), deviceId: new bson_1.ObjectID(deviceId), status: message_interface_1.EMessageStatus.ERROR });
            console.log("messsages are ", messages.length);
            message_queue_service_1.default.sendErrorMessageForDevice(messages, deviceId);
            if (messages)
                return { error: false, messageCount: messages.length };
            throw new httpErrors_1.HTTP401Error("NO_MESSAGES_FOUND");
        });
    }
    addMessageToQueue(userId, body, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("send text message request", body, deviceId);
            const device = yield device_model_1.default.findDeviceById(deviceId);
            if (!device)
                throw new httpErrors_1.HTTP400Error("DEVICE_NOT_FOUND");
            let numbers = [];
            if (typeof (body.numbers) === 'string') {
                numbers.push(body.numbers);
            }
            else {
                numbers = body.numbers;
            }
            const messagesBody = [];
            for (let i = 0; i < numbers.length; i++) {
                const to = index_1.sanatizeMobile(numbers[i]);
                if (!utils_1.validateMobile(to))
                    throw new httpErrors_1.HTTP400Error(`${numbers[i]} is not valid Number at index ${i}`);
                const newBody = { phone: device.phone, userId, deviceId: deviceId, sendType: message_interface_1.ESendType.QUEUE, to, message: body.message, status: message_interface_1.EMessageStatus.PENDING };
                messagesBody.push(newBody);
            }
            const result = yield this.addMultipleMessageToQueue(messagesBody);
            if (result && result.error) {
                throw new httpErrors_1.HTTP401Error(result.message);
            }
            delete messagesBody[0].to;
            return { error: false, message: messagesBody[0], numbers };
        });
    }
    addSingleMessageToQueue(messageBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const newMessage = new message_schema_1.MessageQueue(messageBody);
            let data = newMessage.addMessage();
            if (data) {
                return { error: false };
            }
            return { error: true, message: "NOT_ADDED" };
        });
    }
    addMultipleMessageToQueue(messages) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield message_schema_1.MessageQueue.insertMany(messages);
            if (result) {
                return { error: false };
            }
            return { error: true, message: "NOT_ADDED" };
        });
    }
    sendTextMessage(userId, body, deviceId, walletId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                body.to = index_1.sanatizeMobile(body.to);
                if (!utils_1.validateMobile(body.to))
                    throw new httpErrors_1.HTTP401Error(`INVALID_NUMBER`);
                const device = yield device_model_1.default.findDeviceById(deviceId);
                if (!device)
                    throw new httpErrors_1.HTTP400Error("DEVICE_NOT_FOUND");
                yield wallet_model_1.default.validateTransactionAmount(walletId, parseFloat(process.env.TEXT_MESSAGE_RATE));
                const result = yield whatsapp_client_service_1.default.sendTextMessage(device.phone, body.to, body.message);
                const newBody = { phone: device.phone, userId, to: body.to, reason: result === null || result === void 0 ? void 0 : result.message, sendType: message_interface_1.ESendType.FAST, message: body.message, deviceId: deviceId, status: result.error ? message_interface_1.EMessageStatus.ERROR : message_interface_1.EMessageStatus.SENT };
                yield this.saveFastMessage(newBody);
                console.log(result);
                if (result.error) {
                    throw new httpErrors_1.HTTP401Error(result.message);
                }
                const paymentMetaData = { deviceId: deviceId, to: newBody.to };
                const paymentResult = yield wallet_model_1.default.makePaymentFromWallet(walletId, userId, parseFloat(process.env.TEXT_MESSAGE_RATE), `message to ${newBody.to} from device ${device.name}(${device.phone})`, paymentMetaData);
                return { error: false, message: newBody, creditUsed: process.env.TEXT_MESSAGE_RATE, walletBalance: paymentResult.wallet.balance };
            }
            catch (err) {
                throw new httpErrors_1.HTTP400Error(err.message);
            }
        });
    }
    sendImageMessage(body, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield device_model_1.default.findDeviceById(deviceId);
            if (!device)
                throw new httpErrors_1.HTTP400Error("DEVICE_NOT_FOUND");
            const to = body.to;
            const msg = { image: body.locationUrl, caption: body.caption || '' };
            const result = yield whatsapp_client_service_1.default.sendImageMessage(device.phone, to, msg);
            console.log(result);
        });
    }
    saveFastMessage(messageBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const newMessage = new message_schema_1.FastMessage(messageBody);
            let data = yield newMessage.addMessage();
            if (data) {
                return { error: false };
            }
            return { error: true, message: "NOT_ADDED" };
        });
    }
}
exports.MessageModel = MessageModel;
exports.default = new MessageModel();
//# sourceMappingURL=message.model.js.map