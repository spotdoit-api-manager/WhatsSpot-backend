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
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const plans_interface_1 = require("./../plans/plans.interface");
const bson_1 = require("bson");
const httpErrors_1 = require("../../lib/utils/httpErrors");
const message_interface_1 = require("./message.interface");
const message_schema_1 = require("./message.schema");
const whatsapp_client_service_1 = __importDefault(require("../../lib/services/whatsapp/whatsapp-client.service"));
const wallet_model_1 = __importDefault(require("../wallet/wallet.model"));
// import messageQueueService from "../../lib/services/whatsapp/message-queue.service";
const user_model_1 = __importDefault(require("../user/user.model"));
const plans_model_1 = __importDefault(require("../plans/plans.model"));
const logger_1 = __importDefault(require("../../core/logger"));
const phone_handler_1 = require("../../lib/utils/phone.handler");
const device_utils_1 = __importDefault(require("../device/device.utils"));
const message_queue_service_1 = __importDefault(require("../../lib/services/whatsapp/message-queue.service"));
const schedule_service_1 = __importDefault(require("../../lib/services/schedule.service"));
const logFileName = "[MessageModel] : ";
class MessageModel {
    constructor() {
        this.updateMessageStatus = (id, status, reason = null) => __awaiter(this, void 0, void 0, function* () {
            yield message_schema_1.MessageQueue.updateOne({ _id: id }, { status: status, reason: reason });
        });
        this.updateMessageToGroupStatus = (id, contact, status, reason = null) => __awaiter(this, void 0, void 0, function* () {
            yield message_schema_1.MessageQueue.updateOne({ _id: id }, { $push: { contactsSent: { phoneNumber: contact.phoneNumber, name: contact === null || contact === void 0 ? void 0 : contact.name, status: status, reason: reason } } });
        });
    }
    retryFailedMessage(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = yield message_schema_1.MessageQueue.find({ userId: userId, deviceId: deviceId, status: message_interface_1.EMessageStatus.ERROR });
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
            const device = yield device_utils_1.default.findDeviceById(userId, deviceId);
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
                body.numbers.forEach((phone) => {
                    const parsedPhone = (0, phone_handler_1.parsePhone)(phone);
                    numbers.push(parsedPhone.number);
                });
            }
            for (let i = 0; i < numbers.length; i++) {
                const to = numbers[i];
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
    scheduleMessage(userId, body, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const scheduleTime = new Date(body.scheduleTime);
            if (!scheduleTime)
                throw new httpErrors_1.HTTP400Error("INVALID_SCHEDULE_TIME", "Schedule time is invalid");
            const currentTime = new Date();
            const diff = scheduleTime.getTime() - currentTime.getTime();
            const preMin = 1;
            // if(diff < preMin*60*1000 ) throw new HTTP400Error("INVALID_SCHEDULE_TIME", "Schedule time should be in future and more than 5 minutes");
            logger_1.default.debug(logFileName, "schedule message request", body, deviceId);
            const device = yield device_utils_1.default.findDeviceById(userId, deviceId);
            if (!device)
                throw new httpErrors_1.HTTP400Error("DEVICE_NOT_FOUND");
            const messagesBody = [];
            if (body.isGroup) {
                body.groups.forEach((group) => {
                    const newBody = { phone: device.phone, userId, deviceId: deviceId, sendType: message_interface_1.ESendType.SCHEDULE, to: group._id, messageType: body.messageType, message: body.message, status: message_interface_1.EMessageStatus.PENDING, isGroup: true, scheduleTime };
                    messagesBody.push(newBody);
                });
                return yield this.addMultipleScheduleMessage(messagesBody);
            }
            const numbers = [];
            if (typeof (body.numbers) === "string") {
                numbers.push(body.numbers);
            }
            else {
                body.numbers.forEach((phone) => {
                    const parsedPhone = (0, phone_handler_1.parsePhone)(phone);
                    numbers.push(parsedPhone.number);
                });
            }
            for (let i = 0; i < numbers.length; i++) {
                const to = numbers[i];
                const newBody = { phone: device.phone, userId, deviceId: deviceId, sendType: message_interface_1.ESendType.SCHEDULE, to, messageType: body.messageType, message: body.message, status: message_interface_1.EMessageStatus.PENDING, scheduleTime };
                messagesBody.push(newBody);
            }
            const result = yield this.addMultipleScheduleMessage(messagesBody);
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
    addMultipleScheduleMessage(messages) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield message_schema_1.ScheduleMessage.insertMany(messages);
            // get inserted records
            const insertedRecords = yield message_schema_1.ScheduleMessage.find({ _id: { $in: result.map((item) => item._id) } });
            schedule_service_1.default.scheduleMessages(insertedRecords);
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
            if (userCurrentPlan) {
                const isMessageOver = userCurrentPlan.planStatus == plans_interface_1.EPlanStatus.EXHAUSTED;
                return { hasActivePlan: true, isMessageOver: isMessageOver, activePlanInfo: userCurrentPlan };
            }
            return { hasActivePlan: false };
        });
    }
    sendFastMessage(userId, numbers, message, messageType, deviceId, walletId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof numbers !== "string")
                throw new httpErrors_1.HTTP401Error("FAST_LIMIT", "fast messages can be only send to 1 contacts per request , please send to single contact in req body");
            const device = yield device_utils_1.default.findDeviceById(userId, deviceId);
            if (!device)
                throw new httpErrors_1.HTTP400Error("DEVICE_NOT_FOUND");
            const results = [];
            const parsedNumber = (0, phone_handler_1.parsePhone)(numbers).number;
            const result = yield this.sendMessage(userId, parsedNumber, message, messageType, deviceId, walletId);
            const newBody = { phone: device.phone, userId, to: parsedNumber, reason: result === null || result === void 0 ? void 0 : result.message, sendType: message_interface_1.ESendType.FAST, messageType, message: message, deviceId: deviceId, status: result.error ? message_interface_1.EMessageStatus.ERROR : message_interface_1.EMessageStatus.SENT };
            const saveResult = yield this.saveFastMessage(newBody);
            results.push(Object.assign(Object.assign({}, result), { messageInfo: saveResult.data }));
            return results;
        });
    }
    sendMessage(userId, to, message, messageType, deviceId, walletId, transactionId = null) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const device = yield device_utils_1.default.findDeviceById(userId, deviceId);
                if (!device)
                    throw new httpErrors_1.HTTP400Error("DEVICE_NOT_FOUND");
                const { hasActivePlan, isMessageOver, activePlanInfo } = yield this.hasActivePlan(userId);
                if (isMessageOver)
                    throw new httpErrors_1.HTTP400Error("MESSAGES_EXHAUSTED", "message exhausted for your active plan");
                if (!hasActivePlan) {
                    const { isValidAmount, balance } = yield wallet_model_1.default.validateTransactionAmount(walletId, parseFloat(process.env.TEXT_MESSAGE_RATE));
                    if (!isValidAmount)
                        throw new Error("NOT_ENOUGH_BALANCE");
                }
                const result = yield whatsapp_client_service_1.default.sendTypeMessage(messageType, message, device.phone, to);
                if (result.error)
                    throw Error(result.message);
                if (hasActivePlan) {
                    plans_model_1.default.increamentMessageCount(activePlanInfo._id);
                    return { error: false, creditUsed: 0, message: result.message };
                }
                else {
                    const paymentMetaData = { deviceId: deviceId, to: to };
                    const paymentResult = yield wallet_model_1.default.makePaymentFromWallet(walletId, userId, parseFloat(process.env.TEXT_MESSAGE_RATE), `message to ${to} from device ${device.name}(${device.phone})`, paymentMetaData);
                    return { error: false, creditUsed: parseFloat(process.env.TEXT_MESSAGE_RATE), walletBalance: paymentResult.wallet.balance, message: result.message };
                }
            }
            catch (err) {
                logger_1.default.error(logFileName, err);
                throw new httpErrors_1.HTTP400Error(err.message);
            }
        });
    }
    sendImageMessage(userId, deviceId, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield device_utils_1.default.findDeviceById(userId, deviceId);
            if (!device)
                throw new httpErrors_1.HTTP400Error("DEVICE_NOT_FOUND");
            const to = (0, phone_handler_1.parsePhone)(body.to).number;
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
}
exports.MessageModel = MessageModel;
exports.default = new MessageModel();
//# sourceMappingURL=message.model.js.map