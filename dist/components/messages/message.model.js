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
const whatsapp_enum_1 = require("./../../lib/services/whatsapp/whatsapp.enum");
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
const user_model_1 = __importDefault(require("../user/user.model"));
const plans_model_1 = __importDefault(require("../plans/plans.model"));
const logger_1 = __importDefault(require("../../core/logger"));
const logFileName = "[MessageModel] : ";
class MessageModel {
    constructor() {
        this.updateMessageStatus = (id, status, reason = null) => __awaiter(this, void 0, void 0, function* () {
            yield message_schema_1.MessageQueue.updateOne({ _id: id }, { status: status, reason: reason });
        });
        this.updateMessageToGroupStatus = (id, contact, status, reason = null) => __awaiter(this, void 0, void 0, function* () {
            yield message_schema_1.MessageQueue.updateOne({ _id: id }, { $push: { contactsSent: { phoneNumber: contact.phoneNumber, name: contact.name, status: status, reason: reason } } });
        });
    }
    retryFailedMessage(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = yield message_schema_1.MessageQueue.find({ userId: new bson_1.ObjectID(userId), deviceId: new bson_1.ObjectID(deviceId), status: message_interface_1.EMessageStatus.ERROR });
            logger_1.default.info(logFileName, `Found ${messages.length} Failed Messages for user ${userId}`);
            message_queue_service_1.default.sendErrorMessageForDevice(messages, deviceId);
            if (messages)
                return { error: false, messageCount: messages.length };
            throw new httpErrors_1.HTTP401Error("NO_MESSAGES_FOUND");
        });
    }
    addMessageToQueue(userId, body, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.debug(logFileName, "add to queue request", body, deviceId);
            const device = yield device_model_1.default.findDeviceById(deviceId);
            if (!device)
                throw new httpErrors_1.HTTP400Error("DEVICE_NOT_FOUND");
            const messagesBody = [];
            if (body.isGroup) {
                body.groups.forEach((group) => {
                    const newBody = { phone: device.phone, userId, deviceId: deviceId, sendType: message_interface_1.ESendType.QUEUE, to: group._id, messageType: body.messageType, message: body.message, status: message_interface_1.EMessageStatus.PENDING, isGroup: true };
                    messagesBody.push(newBody);
                });
                return yield this.addMultipleMessageToQueue(messagesBody);
            }
            const numbers = [];
            if (typeof (body.numbers) === "string") {
                numbers.push(body.numbers);
            }
            else {
                body.numbers.forEach((contact) => {
                    numbers.push(contact.phoneNumber);
                });
            }
            for (let i = 0; i < numbers.length; i++) {
                const to = index_1.sanatizeMobile(numbers[i]);
                if (!utils_1.validateMobile(to))
                    throw new httpErrors_1.HTTP400Error(`${numbers[i]} is not valid Number at index ${i}`);
                const newBody = { phone: device.phone, userId, deviceId: deviceId, sendType: message_interface_1.ESendType.QUEUE, to, messageType: body.messageType, message: body.message, status: message_interface_1.EMessageStatus.PENDING };
                messagesBody.push(newBody);
            }
            const result = yield this.addMultipleMessageToQueue(messagesBody);
            if (result && result.error) {
                throw new httpErrors_1.HTTP401Error(result.message);
            }
            delete messagesBody[0].to;
            return { error: false, messageInfo: result.result, numbers };
        });
    }
    addSingleMessageToQueue(messageBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const newMessage = new message_schema_1.MessageQueue(messageBody);
            const data = newMessage.addMessage();
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
                return { error: false, result };
            }
            return { error: true, message: "NOT_ADDED" };
        });
    }
    fetchGroupMessageSentContacts(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield message_schema_1.MessageQueue.aggregate([
                { $match: { _id: new bson_1.ObjectID(messageId) } },
                {
                    $project: {
                        contactsSent: 1
                    }
                }
            ]);
            // console.log("sent contact ",result);
            return result;
        });
    }
    hasActivePlan(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userCurrentPlan = yield user_model_1.default.fetchUserActivePlan(userId);
            if (userCurrentPlan && userCurrentPlan.activePlanInfo) {
                const isMessageOver = !Boolean(userCurrentPlan.planInfo.planMaxMessage - userCurrentPlan.activePlanInfo.sentMessageCount);
                console.log(`isMessageOver is ${isMessageOver}`);
                return { hasActivePlan: true, isMessageOver, activePlanInfo: userCurrentPlan.activePlanInfo, planInfo: userCurrentPlan.planInfo };
            }
            return { hasActivePlan: false };
        });
    }
    // private isPlanReachedMaxMessage(userCurrentPlan) {
    // }
    sendFastMessage(userId, numbers, message, messageType, deviceId, walletId) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield device_model_1.default.findDeviceById(deviceId);
            if (!device)
                throw new httpErrors_1.HTTP400Error("DEVICE_NOT_FOUND");
            const results = [];
            if (typeof numbers == "string") {
                const result = yield this.sendMessage(userId, numbers, message, messageType, deviceId, walletId);
                const newBody = { phone: device.phone, userId, to: numbers, reason: result === null || result === void 0 ? void 0 : result.message, sendType: message_interface_1.ESendType.FAST, messageType: whatsapp_enum_1.EWhatsappMessageTypes.TEXT_MESSAGE, message: message, deviceId: deviceId, status: result.error ? message_interface_1.EMessageStatus.ERROR : message_interface_1.EMessageStatus.SENT };
                const saveResult = yield this.saveFastMessage(newBody);
                results.push(Object.assign(Object.assign({}, result), { messageInfo: saveResult.data }));
            }
            else if (typeof numbers == "object") {
                numbers.forEach((number, index) => {
                    const to = index_1.sanatizeMobile(number);
                    if (!utils_1.validateMobile(to))
                        throw new httpErrors_1.HTTP401Error(`Invalid number ${number} at ${index}`);
                });
                for (let i = 0; i < numbers.length; i++) {
                    const to = index_1.sanatizeMobile(numbers[i]);
                    const result = yield this.sendMessage(userId, to, message, messageType, deviceId, walletId);
                    results.push(Object.assign(Object.assign({}, result), { messageInfo: { phone: device.phone, message, to: numbers, messageType: whatsapp_enum_1.EWhatsappMessageTypes.TEXT_MESSAGE, userId, deviceId } }));
                    const newBody = { phone: device.phone, userId, to, reason: result === null || result === void 0 ? void 0 : result.message, sendType: message_interface_1.ESendType.FAST, messageType: whatsapp_enum_1.EWhatsappMessageTypes.TEXT_MESSAGE, message: message, deviceId: deviceId, status: result.error ? message_interface_1.EMessageStatus.ERROR : message_interface_1.EMessageStatus.SENT };
                    const saveResult = yield this.saveFastMessage(newBody);
                    results.push(Object.assign(Object.assign({}, result), { messageInfo: saveResult.data }));
                }
            }
            else {
                throw new httpErrors_1.HTTP400Error("INVALID_NUMBER_TYPE");
            }
            logger_1.default.info(logFileName, results);
            return results;
        });
    }
    sendMessage(userId, to, message, messageType, deviceId, walletId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                to = index_1.sanatizeMobile(to);
                if (!utils_1.validateMobile(to))
                    throw new httpErrors_1.HTTP401Error("INVALID_NUMBER");
                const device = yield device_model_1.default.findDeviceById(deviceId);
                if (!device)
                    throw new httpErrors_1.HTTP400Error("DEVICE_NOT_FOUND");
                const { hasActivePlan, isMessageOver, activePlanInfo, planInfo } = yield this.hasActivePlan(userId);
                if (isMessageOver)
                    throw new httpErrors_1.HTTP400Error("MESSAGES_EXHAUSTED", "message exhausted for your active plan");
                logger_1.default.info(logFileName, `User ${userId} hasPlanActive: ${hasActivePlan}`);
                if (!hasActivePlan) {
                    const { isValidAmount, balance } = yield wallet_model_1.default.validateTransactionAmount(walletId, parseFloat(process.env.TEXT_MESSAGE_RATE));
                    logger_1.default.info(logFileName, `validAMount ${isValidAmount}`);
                    if (!isValidAmount)
                        throw new Error("NOT_ENOUGH_BALANCE");
                }
                const result = yield this.sendTypeMessage(messageType, message, device.phone, to);
                if (result.error)
                    return result;
                if (hasActivePlan) {
                    yield plans_model_1.default.increamentMessageCount(activePlanInfo._id);
                    return { error: false, creditUsed: 0, message: result.message };
                }
                else {
                    const paymentMetaData = { deviceId: deviceId, to: to };
                    const paymentResult = yield wallet_model_1.default.makePaymentFromWallet(walletId, userId, parseFloat(process.env.TEXT_MESSAGE_RATE), `message to ${to} from device ${device.name}(${device.phone})`, paymentMetaData);
                    return { error: false, creditUsed: process.env.TEXT_MESSAGE_RATE, walletBalance: paymentResult.wallet.balance, message: result.message };
                }
            }
            catch (err) {
                logger_1.default.error(logFileName, err);
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
            const msg = { image: body.locationUrl, caption: body.caption || "" };
            const result = yield whatsapp_client_service_1.default.sendImageMessage(device.phone, to, msg);
            // console.log(result);
        });
    }
    saveFastMessage(messageBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const newMessage = new message_schema_1.FastMessage(messageBody);
            const data = yield newMessage.addMessage();
            if (data) {
                return { error: false, data };
            }
            return { error: true, message: "NOT_ADDED" };
        });
    }
    sendTypeMessage(messageType, message, from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("sending type message ", messageType);
            switch (messageType) {
                case whatsapp_enum_1.EWhatsappMessageTypes.TEXT_MESSAGE:
                    return yield whatsapp_client_service_1.default.sendTextMessage(from, to, message);
                case whatsapp_enum_1.EWhatsappMessageTypes.LIST_MESSAGE:
                    return yield whatsapp_client_service_1.default.sendListMessage(from, to, message);
                case whatsapp_enum_1.EWhatsappMessageTypes.BUTTON_MESSAGE:
                    return yield whatsapp_client_service_1.default.sendButtonMessage(from, to, message);
            }
        });
    }
}
exports.MessageModel = MessageModel;
exports.default = new MessageModel();
//# sourceMappingURL=message.model.js.map