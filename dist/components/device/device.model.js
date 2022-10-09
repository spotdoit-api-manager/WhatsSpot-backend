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
exports.DeviceModel = void 0;
const logger_1 = __importDefault(require("../../core/logger"));
const index_1 = require("./../../config/index");
const message_interface_1 = require("./../messages/message.interface");
const httpErrors_1 = require("./../../lib/utils/httpErrors");
const device_interface_1 = require("./device.interface");
const device_schema_1 = require("./device.schema");
const whatsapp_client_service_1 = __importDefault(require("../../lib/services/whatsapp/whatsapp-client.service"));
const file_management_1 = __importDefault(require("../../lib/helpers/file.management"));
const message_model_1 = __importDefault(require("../messages/message.model"));
const bson_1 = require("bson");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dayjs_1 = __importDefault(require("dayjs"));
const otpHandler = __importStar(require("../../lib/services/otp-handler"));
const user_model_1 = __importDefault(require("../user/user.model"));
const api_blocklist_model_1 = __importDefault(require("../api-blocklist/api-blocklist.model"));
const schedular_1 = __importDefault(require("../../lib/services/schedular"));
const phone_handler_1 = require("../../lib/utils/phone.handler");
const projection_values_1 = require("../../lib/values/projection.values");
const plans_model_1 = __importDefault(require("../plans/plans.model"));
const device_utils_1 = __importDefault(require("./device.utils"));
const logFileName = "[DeviceModal] : ";
class DeviceModel {
    constructor() {
        this.fetchAllDevices = (userId) => __awaiter(this, void 0, void 0, function* () {
            const devices = yield this.findDeviceByUseId(userId);
            if (!devices || !devices.length)
                throw new httpErrors_1.HTTP400Error("NO_DEVICE_ADDED");
            return devices;
        });
        this.fetchDevice = (deviceId, userId) => __awaiter(this, void 0, void 0, function* () {
            const device = yield this.fetchDeviceByCondition(deviceId, userId);
            return device;
        });
        this.signDeviceToken = (apiKeyData, expiresIn) => {
            if (!expiresIn) {
                return jsonwebtoken_1.default.sign(apiKeyData, index_1.deviceKeyConfig.jwtSecretKey, {});
            }
            return jsonwebtoken_1.default.sign(apiKeyData, index_1.deviceKeyConfig.jwtSecretKey, {
                expiresIn: expiresIn,
            });
        };
    }
    newDevice(userId, walletId, body, newDeviceCode) {
        return __awaiter(this, void 0, void 0, function* () {
            body.userId = userId;
            yield this.isMaxDeviceLimitReached(userId);
            const parsedPhone = phone_handler_1.parsePhoneWithCountry(body.phone, body.country).number;
            const device = yield this.findDeviceByPhone(parsedPhone);
            this.validateDeviceAdd(userId, device);
            yield user_model_1.default.validateDeviceCode(userId, parsedPhone, parseInt(newDeviceCode));
            logger_1.default.info(logFileName, `Device ${parsedPhone} verified`);
            body.phone = parsedPhone;
            const newDevice = new device_schema_1.Device(body);
            const newDeviceData = yield newDevice.saveDevice();
            if (!newDeviceData)
                throw new httpErrors_1.HTTP400Error("UNKNOWN_ERROR");
            const expiresOn = dayjs_1.default().add(parseInt((process.env.DEFAULT_APIKEY_EXPIRYES_IN || "3d").replace("d", "")), "day").toDate().toUTCString();
            const keys = yield this.generateNewKey(userId, walletId, newDeviceData._id, { name: process.env.DEFAULT_APIKEY_NAME, expiresOn });
            return newDeviceData;
        });
    }
    isMaxDeviceLimitReached(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const devices = yield device_schema_1.Device.find({ userId: new bson_1.ObjectID(userId), "isDeleted.status": false });
            const userPlan = yield user_model_1.default.fetchUserActivePlan(userId);
            if (userPlan && userPlan.planId) {
                const plan = yield plans_model_1.default.fetchPlanByPlanId(userPlan.planId);
                if (devices.length >= plan.maxDevices)
                    throw new httpErrors_1.HTTP400Error("MAX_DEVICE_LIMIT_REACHED", `You have reached maximum device limit of ${plan.maxDevices} in your ${plan.planName} plan`);
            }
            else {
                if (devices.length >= parseInt(process.env.DEFAULT_MAX_DEVICES || "1"))
                    throw new httpErrors_1.HTTP400Error("MAX_DEVICE_LIMIT_REACHED", `You have reached maximum device limit of ${process.env.DEFAULT_MAX_DEVICES || "1"}`);
            }
            return false;
        });
    }
    newDeviceCode(userId, walletId, newDeviceBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsedPhone = phone_handler_1.parsePhoneWithCountry(newDeviceBody.phone, newDeviceBody.country).number;
            const device = yield this.findDeviceByPhone(parsedPhone);
            this.validateDeviceAdd(userId, device);
            const code = yield user_model_1.default.updateDeviceCode(userId, parsedPhone);
            const result = yield otpHandler.sendNewDeviceCode(parsedPhone, code);
            return result;
        });
    }
    validateDeviceAdd(userId, device) {
        if (device && device.userId == userId)
            return device;
        else if (device && device.userId != userId)
            throw new httpErrors_1.HTTP401Error("DEVICE_ALREADY_REGISTERD", "This device is already added by some user");
    }
    getQr(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield device_utils_1.default.findDeviceById(userId, deviceId);
            if (!device)
                throw new httpErrors_1.HTTP400Error("DEVICE_NOT_FOUND");
            if (device.authState)
                return { error: true, message: "ALREADY_AUTHENTICATED" };
            // if (!device.authState && device.reason && device.reason.statusCode === DisconnectReason.loggedOut) {
            //     return { message: "DEVICE_LOGGED_OUT" };
            // }
            const data = whatsapp_client_service_1.default.getClientQr(deviceId, device.phone);
            return { message: "QR_REQUESTED" };
        });
    }
    removeClient(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield device_utils_1.default.findDeviceById(userId, deviceId);
            if (!device)
                throw new httpErrors_1.HTTP400Error("DEVICE_NOT_FOUND");
            const data = whatsapp_client_service_1.default.removeClientInstanceByPhone(device.phone);
            return { message: "CLIENT_REMOVED" };
        });
    }
    fetchDeviceByCondition(deviceId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield device_schema_1.Device.aggregate([
                { $match: { _id: new bson_1.ObjectID(deviceId), userId: new bson_1.ObjectID(userId), "isDeleted.status": false } },
                {
                    $project: {
                        apiKeys: 0
                    }
                }
            ]);
            return result[0] || null;
        });
    }
    fetchDevicesMetrics() {
        return __awaiter(this, void 0, void 0, function* () {
            const totalDevices = yield device_schema_1.Device.countDocuments();
            const activeDevices = yield device_schema_1.Device.countDocuments({ authState: true });
            const deletedDevices = yield device_schema_1.Device.countDocuments({ "isDeleted.status": true });
            return { totalDevices, activeDevices, deletedDevices };
        });
    }
    fetchPrevMessages(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messages = yield this.fetchMessagesByStatus(deviceId);
                if (!messages || !messages.length)
                    throw new httpErrors_1.HTTP400Error("NO_MESSAGES");
                return messages;
            }
            catch (err) {
                throw new httpErrors_1.HTTP400Error(err.message);
            }
        });
    }
    fetchMessagesByStatus(deviceId, status = null) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const condition = { _id: new bson_1.ObjectID(deviceId) };
            if (status)
                condition.status = status;
            const result = yield device_schema_1.Device.aggregate([
                { $match: condition },
                { $set: { _id: { $toObjectId: "$_id" } } },
                {
                    $project: {
                        _id: 1
                    }
                },
                {
                    $lookup: {
                        from: "fastmessages",
                        localField: "_id",
                        foreignField: "deviceId",
                        as: "fastMessages"
                    },
                },
                {
                    $lookup: {
                        from: "messagequeues",
                        localField: "_id",
                        foreignField: "deviceId",
                        as: "queueMessages"
                    },
                },
                {
                    $project: {
                        messages: { $setUnion: ["$fastMessages", "$queueMessages"] }
                    }
                },
                { $unwind: "$messages" },
                {
                    $sort: {
                        "messages.createdAt": -1
                    }
                },
                { $group: { _id: "$_id", messages: { $push: "$messages" } } }
            ]);
            return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.messages) || null;
        });
    }
    deleteAuth(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("params ", userId, deviceId);
            const device = yield device_utils_1.default.findDeviceById(userId, deviceId);
            if (!device)
                throw new httpErrors_1.HTTP400Error("DEVICE_NOT_FOUND");
            const authFilePath = `${process.env.SESSIONS_FOLDER}/${device.phone}_cred.json`;
            const res = yield file_management_1.default.deleteFile(authFilePath);
            if (res.error)
                throw new httpErrors_1.HTTP401Error(res.message);
            yield device_utils_1.default.updateDevice(device._id, { reason: null });
            return { message: "DEVICE_LOGGEDOUT" };
        });
    }
    logoutDevice(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield device_utils_1.default.findDeviceById(userId, deviceId);
            if (!device)
                throw new httpErrors_1.HTTP400Error("DEVICE_NOT_FOUND");
            const authFilePath = `${process.env.SESSIONS_FOLDER}/${device.phone}_cred.json`;
            yield file_management_1.default.deleteFile(authFilePath);
            const data = yield whatsapp_client_service_1.default.logoutClient(device.phone);
            if (data.error)
                throw new httpErrors_1.HTTP400Error(data.message);
            return { message: "DEVICE_LOGGED_OUT", device: device };
        });
    }
    generateNewKey(userId, walletId, deviceId, body) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!body.name || !body.expiresOn)
                throw new httpErrors_1.HTTP400Error("Fields missing");
            try {
                let expiresIn = null;
                let expiresOn;
                if (body.expiresOn != "NEVER") {
                    expiresOn = dayjs_1.default(new Date(body.expiresOn));
                    const diff = expiresOn.diff(dayjs_1.default(), "day", true);
                    expiresIn = `${Math.floor(diff)}d`;
                }
                else {
                    expiresOn = dayjs_1.default();
                    expiresOn.add(50, "year");
                }
                const totalAvailableKeys = yield this.getTotalAvailableApiKeys(deviceId);
                if (totalAvailableKeys < parseInt(process.env.MAX_APIKEY_PER_DEVICE)) {
                    const apiKeyData = { walletId, userId, deviceId };
                    const token = this.generateDeviceKey(apiKeyData, expiresIn);
                    const tokenData = { name: body.name, createdOn: new Date(), token: token, expiresOn: expiresOn === null || expiresOn === void 0 ? void 0 : expiresOn.toDate(), status: { status: device_interface_1.EApiKeyStatus.ACTIVE, reason: null } };
                    yield this.addNewTokenDataToDevice(deviceId, tokenData);
                    return tokenData;
                }
                throw new httpErrors_1.HTTP400Error("MAX_API_KEY_REACHED");
            }
            catch (err) {
                throw new httpErrors_1.HTTP400Error(err.message);
            }
        });
    }
    deleteKey(deviceId, keyId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield device_schema_1.Device.findOneAndUpdate({ _id: new bson_1.ObjectID(deviceId) }, { $pull: { apiKeys: { _id: new bson_1.ObjectID(keyId) } } }, { upsert: false, new: false }).lean();
                const apiData = result.apiKeys.find((x) => x._id.toString() === keyId);
                if (apiData.status !== device_interface_1.EApiKeyStatus.EXPIRED) {
                    yield api_blocklist_model_1.default.addApiToBlockList(deviceId, apiData);
                }
            }
            catch (err) {
                throw new httpErrors_1.HTTP400Error(err.message);
            }
        });
    }
    getKeys(deviceId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const keys = yield device_schema_1.Device.aggregate([
                { $match: { _id: new bson_1.ObjectID(deviceId) } },
                {
                    $project: {
                        apiKeys: 1
                    }
                }
            ]);
            return ((_a = keys[0]) === null || _a === void 0 ? void 0 : _a.apiKeys) || null;
        });
    }
    addNewTokenDataToDevice(deviceId, tokenData) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield device_schema_1.Device.findByIdAndUpdate(deviceId, { $push: { apiKeys: tokenData } }, { "upsert": true, new: true }).lean();
            yield schedular_1.default.scheduleApiExpiration(deviceId, result.apiKeys[result.apiKeys.length - 1]);
        });
    }
    generateDeviceKey(apiKeyData, expiresIn) {
        const token = this.signDeviceToken(apiKeyData, expiresIn);
        return token;
    }
    getTotalAvailableApiKeys(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield device_schema_1.Device.aggregate([
                { $match: { _id: new bson_1.ObjectID(deviceId) } },
                {
                    $project: {
                        count: { $cond: { if: { $isArray: "$apiKeys" }, then: { $size: "$apiKeys" }, else: 0 } }
                    }
                }
            ]);
            return result[0].count;
        });
    }
    findDeviceByPhone(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield device_schema_1.Device.findOne({ phone, "isDeleted.status": false });
            return device;
        });
    }
    findDeviceByUseId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const devices = yield device_schema_1.Device.find({ userId: userId, "isDeleted.status": false }).lean();
            return devices;
        });
    }
    findDeviceByIdAndUserId(deviceId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield device_schema_1.Device.aggregate([
                {
                    $match: { _id: new bson_1.ObjectID(deviceId), userId: new bson_1.ObjectID(userId) }
                }, {
                    $project: {
                        _id: 1
                    }
                }
            ]);
            return result[0] || null;
        });
    }
    fetchDeviceMetrics(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const condition = { _id: new bson_1.ObjectID(deviceId), "isDeleted.status": false };
                let result = yield device_schema_1.Device.aggregate([
                    { $match: condition },
                    { $set: { _id: { $toObjectId: "$_id" } } },
                    {
                        $lookup: {
                            from: "fastmessages",
                            localField: "_id",
                            foreignField: "deviceId",
                            as: "fastMessages"
                        },
                    },
                    {
                        $lookup: {
                            from: "messagequeues",
                            localField: "_id",
                            foreignField: "deviceId",
                            as: "queueMessages"
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            messageMetrics: {
                                totalFastError: {
                                    $size: {
                                        $filter: {
                                            input: "$fastMessages",
                                            as: "fastMessage",
                                            cond: { "$eq": ["$$fastMessage.status", message_interface_1.EMessageStatus.ERROR] }
                                        }
                                    }
                                },
                                totalFastSuccess: {
                                    $size: {
                                        $filter: {
                                            input: "$fastMessages",
                                            as: "fastMessage",
                                            cond: { "$eq": ["$$fastMessage.status", message_interface_1.EMessageStatus.SENT] }
                                        }
                                    }
                                },
                                totalQueueSuccess: {
                                    $size: {
                                        $filter: {
                                            input: "$queueMessages",
                                            as: "queueMessage",
                                            cond: { "$eq": ["$$queueMessage.status", message_interface_1.EMessageStatus.SENT] }
                                        }
                                    }
                                },
                                totalQueueError: {
                                    $size: {
                                        $filter: {
                                            input: "$queueMessages",
                                            as: "queueMessage",
                                            cond: { "$eq": ["$$queueMessage.status", message_interface_1.EMessageStatus.ERROR] }
                                        }
                                    }
                                },
                                totalQueuePending: {
                                    $size: {
                                        $filter: {
                                            input: "$queueMessages",
                                            as: "queueMessage",
                                            cond: { "$eq": ["$$queueMessage.status", message_interface_1.EMessageStatus.PENDING] }
                                        }
                                    }
                                }
                            },
                            messages: {
                                fastMessages: "$fastMessages",
                                queueMessages: "$queueMessages",
                            },
                            deviceInfo: {
                                deviceId: "$_id",
                                isDeleted: "$isDeleted",
                                phone: "$phone",
                                name: "$name",
                                userId: "$userId",
                                createdAt: "$createdAt",
                                updatedAt: "$updatedAt",
                                authState: "$authState",
                                reason: "$reason"
                            }
                        }
                    },
                ]);
                if (!result || !result[0]) {
                    result = [
                        {
                            messageMetrics: {
                                totalFastError: 1,
                                totalFastSuccess: 3,
                                totalQueueError: 0,
                                totalQueuePending: 2,
                                totalQueueSuccess: 0
                            }
                        }
                    ];
                }
                return result[0];
            }
            catch (err) {
                console.log(err);
                throw new httpErrors_1.HTTP400Error(err.messages);
            }
        });
    }
    retryFailedMessage(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield message_model_1.default.retryFailedMessage(userId, deviceId);
            if (result.error)
                throw new httpErrors_1.HTTP401Error(result.message);
            return { error: false, message: "RETRY_REQUESTED", messageCount: result.messageCount };
        });
    }
    updateDeviceStatus(deviceId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield device_schema_1.Device.findByIdAndUpdate(deviceId, { deviceStatus: status });
            return result;
        });
    }
    removeDevice(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.logoutDevice(userId, deviceId);
            const result = yield device_schema_1.Device.findByIdAndUpdate(deviceId, { isDeleted: { status: true, deletedAt: new Date() } });
        });
    }
    getDeviceStatus(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield device_schema_1.Device.findOne({ userId: userId, _id: deviceId, isDeleted: { status: false } });
            if (!device)
                throw new httpErrors_1.HTTP400Error("DEVICE_NOT_FOUND");
            return whatsapp_client_service_1.default.getClientStatus(device.phone);
        });
    }
    fetchDevicesList() {
        return device_schema_1.Device.find({}).select(projection_values_1.deviceProjection).lean();
    }
}
exports.DeviceModel = DeviceModel;
exports.default = new DeviceModel();
//# sourceMappingURL=device.model.js.map