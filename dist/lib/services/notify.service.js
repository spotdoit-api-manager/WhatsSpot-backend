"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
exports.NotifyService = void 0;
const notification_interface_1 = require("../interfaces/notification.interface");
const user_schema_1 = require("../../components/user/user.schema");
const message_service_1 = __importDefault(require("./message.service"));
const device_schema_1 = require("../../components/device/device.schema");
const logger_1 = __importDefault(require("../../core/logger"));
const emailService = __importStar(require("./email.service"));
const notification_interface_2 = require("../interfaces/notification.interface");
const CACHE_CLEAR_INTERVAL = 20;
let deviceIdPhoneMap = {};
const logFileName = "[NotifyService] : ";
class NotifyService {
    constructor() {
        this.clearDeviceCache();
    }
    clearDeviceCache() {
        logger_1.default.info(logFileName, `Started interval to clear device data cache every ${CACHE_CLEAR_INTERVAL} minutes`);
        const interval = setInterval(() => {
            deviceIdPhoneMap = {};
        }, CACHE_CLEAR_INTERVAL * 1000);
    }
    checkNotificationSettings(notificationSettings, notificationMainType, channel) {
        if (notificationSettings && notificationSettings[notificationMainType] && notificationSettings[notificationMainType][channel]) {
            return true;
        }
        return false;
    }
    // device event notification
    deviceUnAuthorized(deviceId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info(`Sending DEVICE_UNAUTHORIZED notification for device ${deviceId}`);
                if (!deviceIdPhoneMap[deviceId]) {
                    const device = (yield device_schema_1.Device.findById(deviceId).select("userId phone").lean());
                    const userData = (yield user_schema_1.User.findById(device.userId).select("phone email userName settings").lean());
                    deviceIdPhoneMap[deviceId] = { notificationSettings: (_a = userData === null || userData === void 0 ? void 0 : userData.settings) === null || _a === void 0 ? void 0 : _a.notifications, devicePhone: device.phone, phone: userData.phone, email: userData.email };
                }
                if (this.checkNotificationSettings(deviceIdPhoneMap[deviceId].notificationSettings, notification_interface_1.ENotificationMainTypes.DEVICE, notification_interface_2.ENotificationChannel.WHATSAPP)) {
                    message_service_1.default.sendWhatsappMessage(deviceIdPhoneMap[deviceId].phone, `Your device with Phone ${deviceIdPhoneMap[deviceId].devicePhone} is unauthorized.`);
                }
                if (this.checkNotificationSettings(deviceIdPhoneMap[deviceId].notificationSettings, notification_interface_1.ENotificationMainTypes.DEVICE, notification_interface_2.ENotificationChannel.EMAIL)) {
                    emailService.sendNotificationMail(deviceIdPhoneMap[deviceId].email, "DEVICE UNAUTHORIZED", `Your device with Phone ${deviceIdPhoneMap[deviceId].devicePhone} is unauthorized.`);
                }
            }
            catch (e) {
                logger_1.default.error(`Error sending DEVICE_UNAUTHORIZED notification for device ${deviceId}`, e.message);
            }
        });
    }
    deviceAuthorized(deviceId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info(`Sending DEVICE_AUTHORIZED notification for device ${deviceId}`);
                if (!deviceIdPhoneMap[deviceId]) {
                    const device = (yield device_schema_1.Device.findById(deviceId).select("userId phone").lean());
                    const userData = (yield user_schema_1.User.findById(device.userId).select("phone email userName settings").lean());
                    deviceIdPhoneMap[deviceId] = { notificationSettings: (_a = userData === null || userData === void 0 ? void 0 : userData.settings) === null || _a === void 0 ? void 0 : _a.notifications, devicePhone: device.phone, phone: userData.phone, email: userData.email };
                }
                logger_1.default.info("device cacheche is ", deviceIdPhoneMap);
                if (this.checkNotificationSettings(deviceIdPhoneMap[deviceId].notificationSettings, notification_interface_1.ENotificationMainTypes.DEVICE, notification_interface_2.ENotificationChannel.WHATSAPP)) {
                    message_service_1.default.sendWhatsappMessage(deviceIdPhoneMap[deviceId].phone, `Device with phone ${deviceIdPhoneMap[deviceId].devicePhone} Authorized successfully`);
                }
                if (this.checkNotificationSettings(deviceIdPhoneMap[deviceId].notificationSettings, notification_interface_1.ENotificationMainTypes.DEVICE, notification_interface_2.ENotificationChannel.EMAIL)) {
                    emailService.sendNotificationMail(deviceIdPhoneMap[deviceId].email, "DEVICE AUTHORIZED", `Device with phone ${deviceIdPhoneMap[deviceId].devicePhone} Authorized successfully`);
                }
            }
            catch (e) {
                logger_1.default.error(`Error sending DEVICE_AUTHORIZED notification for device ${deviceId}`, e.message);
            }
        });
    }
    deviceConnectionClosed(deviceId, reason) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info(`Sending DEVICE_CONNECTION_CLOSED notification for device ${deviceId}`);
                if (!deviceIdPhoneMap[deviceId]) {
                    const device = (yield device_schema_1.Device.findById(deviceId).select("userId phone").lean());
                    const userData = (yield user_schema_1.User.findById(device.userId).select("phone email userName settings").lean());
                    deviceIdPhoneMap[deviceId] = { notificationSettings: (_a = userData === null || userData === void 0 ? void 0 : userData.settings) === null || _a === void 0 ? void 0 : _a.notifications, devicePhone: device.phone, phone: userData.phone, email: userData.email };
                }
                if (this.checkNotificationSettings(deviceIdPhoneMap[deviceId].notificationSettings, notification_interface_1.ENotificationMainTypes.DEVICE, notification_interface_2.ENotificationChannel.WHATSAPP)) {
                    emailService.sendNotificationMail(deviceIdPhoneMap[deviceId].email, "DEVICE UNAUTHORIZED", `Your device with Phone ${deviceIdPhoneMap[deviceId].devicePhone} is unauthorized.`);
                }
                if (this.checkNotificationSettings(deviceIdPhoneMap[deviceId].notificationSettings, notification_interface_1.ENotificationMainTypes.DEVICE, notification_interface_2.ENotificationChannel.WHATSAPP)) {
                    message_service_1.default.sendWhatsappMessage(deviceIdPhoneMap[deviceId].phone, `Your device with Phone ${deviceIdPhoneMap[deviceId].devicePhone} is unauthorized.`);
                }
            }
            catch (e) {
                logger_1.default.error(`Error sending DEVICE_CONNECTION_CLOSED notification for device ${deviceId}`, e.message);
            }
        });
    }
    deviceMaxRetryReached(deviceId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info(`Sending DEVICE_MAX_RETRY_REACHED notification for device ${deviceId}`);
                if (!deviceIdPhoneMap[deviceId]) {
                    const device = (yield device_schema_1.Device.findById(deviceId).select("userId phone").lean());
                    const userData = (yield user_schema_1.User.findById(device.userId).select("phone email userName settings").lean());
                    deviceIdPhoneMap[deviceId] = { notificationSettings: (_a = userData === null || userData === void 0 ? void 0 : userData.settings) === null || _a === void 0 ? void 0 : _a.notifications, devicePhone: device.phone, phone: userData.phone, email: userData.email };
                }
                if (this.checkNotificationSettings(deviceIdPhoneMap[deviceId].notificationSettings, notification_interface_1.ENotificationMainTypes.DEVICE, notification_interface_2.ENotificationChannel.WHATSAPP)) {
                    emailService.sendNotificationMail(deviceIdPhoneMap[deviceId].email, "DEVICE UNAUTHORIZED", `Device with phone ${deviceIdPhoneMap[deviceId].devicePhone} has reached max retry to reconnect`);
                }
                if (this.checkNotificationSettings(deviceIdPhoneMap[deviceId].notificationSettings, notification_interface_1.ENotificationMainTypes.DEVICE, notification_interface_2.ENotificationChannel.WHATSAPP)) {
                    message_service_1.default.sendWhatsappMessage(deviceIdPhoneMap[deviceId].phone, `Device with phone ${deviceIdPhoneMap[deviceId].devicePhone} has reached max retry to reconnect`);
                }
            }
            catch (e) {
                logger_1.default.error(`Error sending DEVICE_MAX_RETRY_REACHED notification for device ${deviceId}`, e.message);
            }
        });
    }
    // Plan event notification 
    planExpired(userId, userPlanId) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info(`Sending PLAN_EXPIRED notification for user ${userId} and plan ${userPlanId}`);
                const userData = (yield user_schema_1.User.findById(userId).select("phone email userName settings").lean());
                if (this.checkNotificationSettings((_a = userData === null || userData === void 0 ? void 0 : userData.settings) === null || _a === void 0 ? void 0 : _a.notifications, notification_interface_1.ENotificationMainTypes.PLAN, notification_interface_2.ENotificationChannel.WHATSAPP)) {
                    message_service_1.default.sendWhatsappMessage(userData.phone, `Dear ${(userData === null || userData === void 0 ? void 0 : userData.userName) || "User"}, \n Your plan has been expired. Please purchase new plan to continue the services`);
                }
                if (this.checkNotificationSettings((_b = userData === null || userData === void 0 ? void 0 : userData.settings) === null || _b === void 0 ? void 0 : _b.notifications, notification_interface_1.ENotificationMainTypes.PLAN, notification_interface_2.ENotificationChannel.EMAIL)) {
                    emailService.sendNotificationMail(userData.email, "DEVICE UNAUTHORIZED", `Dear ${(userData === null || userData === void 0 ? void 0 : userData.userName) || "User"}, \n Your plan has been expired. Please purchase new plan to continue the services`);
                }
            }
            catch (e) {
                logger_1.default.error(`Error sending PLAN_EXPIRED notification for user ${userId}  for  plan ${userPlanId}`, e.message);
            }
        });
    }
    planExhausted(userId, userPlanId) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info(`Sending PLAN_EXHAUSTED notification for user ${userId} and plan ${userPlanId}`);
                const userData = (yield user_schema_1.User.findById(userId).select("phone email userName settings").lean());
                if (this.checkNotificationSettings((_a = userData === null || userData === void 0 ? void 0 : userData.settings) === null || _a === void 0 ? void 0 : _a.notifications, notification_interface_1.ENotificationMainTypes.PLAN, notification_interface_2.ENotificationChannel.WHATSAPP)) {
                    message_service_1.default.sendWhatsappMessage(userData.phone, `Dear ${(userData === null || userData === void 0 ? void 0 : userData.userName) || "User"}, \n Your plan has reached max message limit. Please purchase new plan to continue the services`);
                }
                if (this.checkNotificationSettings((_b = userData === null || userData === void 0 ? void 0 : userData.settings) === null || _b === void 0 ? void 0 : _b.notifications, notification_interface_1.ENotificationMainTypes.PLAN, notification_interface_2.ENotificationChannel.EMAIL)) {
                    emailService.sendNotificationMail(userData.email, "PLAN EXHAUSTED", `Dear ${(userData === null || userData === void 0 ? void 0 : userData.userName) || "User"}, \n Your plan has reached max message limit. Please purchase new plan to continue the services`);
                }
            }
            catch (e) {
                logger_1.default.error(`Error sending PLAN_EXHAUSTED notification for user ${userId}  for  plan ${userPlanId}`, e.message);
            }
        });
    }
    planActivated(userId, userPlanId) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            // return;
            try {
                logger_1.default.info(`Sending PLAN_ACTIVATED notification for user ${userId} and plan ${userPlanId}`);
                const userData = (yield user_schema_1.User.findById(userId).select("phone email userName settings").lean());
                if (this.checkNotificationSettings((_a = userData === null || userData === void 0 ? void 0 : userData.settings) === null || _a === void 0 ? void 0 : _a.notifications, notification_interface_1.ENotificationMainTypes.PLAN, notification_interface_2.ENotificationChannel.WHATSAPP)) {
                    message_service_1.default.sendWhatsappMessage(userData.phone, `Dear ${(userData === null || userData === void 0 ? void 0 : userData.userName) || "User"}, \n You plan has been activated.`);
                }
                if (this.checkNotificationSettings((_b = userData === null || userData === void 0 ? void 0 : userData.settings) === null || _b === void 0 ? void 0 : _b.notifications, notification_interface_1.ENotificationMainTypes.PLAN, notification_interface_2.ENotificationChannel.EMAIL)) {
                    emailService.sendNotificationMail(userData.email, "PLAN ACTIVATED", `Dear ${(userData === null || userData === void 0 ? void 0 : userData.userName) || "User"}, \n You plan has been activated.`);
                }
            }
            catch (e) {
                logger_1.default.error(`Error sending PLAN_ACTIVATED notification for user ${userId}  for  plan ${userPlanId}`, e.message);
            }
        });
    }
    walletBalanceAdded(userId, added, balance, currency) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            // return;
            try {
                logger_1.default.info(`Sending BALANCE_ADDED notification for user ${userId} added ${added} amount ${balance}`);
                const userData = (yield user_schema_1.User.findById(userId).select("phone email userName settings").lean());
                if (this.checkNotificationSettings((_a = userData === null || userData === void 0 ? void 0 : userData.settings) === null || _a === void 0 ? void 0 : _a.notifications, notification_interface_1.ENotificationMainTypes.PLAN, notification_interface_2.ENotificationChannel.WHATSAPP)) {
                    message_service_1.default.sendWhatsappMessage(userData.phone, `Dear ${(userData === null || userData === void 0 ? void 0 : userData.userName) || "User"}, \n ${currency} ${added} added to your wallet.Total balance ${balance}.`);
                }
                if (this.checkNotificationSettings((_b = userData === null || userData === void 0 ? void 0 : userData.settings) === null || _b === void 0 ? void 0 : _b.notifications, notification_interface_1.ENotificationMainTypes.PLAN, notification_interface_2.ENotificationChannel.EMAIL)) {
                    emailService.sendNotificationMail(userData.email, "Balance Added", `Dear ${(userData === null || userData === void 0 ? void 0 : userData.userName) || "User"}, \n ${currency} ${added} added to your wallet.Total balance ${balance}.`);
                }
            }
            catch (e) {
                logger_1.default.error(`Error sending BALANCE_ADDED notification for user ${userId}`, e.message);
            }
        });
    }
    paymentApproveRequest(userId, planId, amount, transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info(`Sending PAYMENT_APPROVAL notification for user ${userId} and plan ${planId}`);
                const userData = (yield user_schema_1.User.findById(userId).select("phone email userName settings").lean());
                // if(this.checkNotificationSettings(userData?.settings?.notifications, ENotificationMainTypes.PLAN, ENotificationChannel.WHATSAPP)){
                message_service_1.default.sendWhatsappMessage(userData.phone, `Dear ${(userData === null || userData === void 0 ? void 0 : userData.userName) || "User"}, \n We have received your payment request approval for amount INR ${amount} with transactionId ${transactionId}.`);
                // }
                // if(this.checkNotificationSettings(userData?.settings?.notifications, ENotificationMainTypes.PLAN, ENotificationChannel.EMAIL)){
                emailService.sendNotificationMail(userData.email, "PAYMENT APPROVAL REQUEST", `Dear ${(userData === null || userData === void 0 ? void 0 : userData.userName) || "User"}, \n We have received your payment request approval for transactionId ${transactionId}.`);
                // }
            }
            catch (e) {
                logger_1.default.error(`Error sending PAYMENT_APPROVAL notification for user ${userId}  for  plan ${planId}`, e.message);
            }
        });
    }
    paymentApprove(userId, planId, amount, transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info(`Sending PAYMENT_APPROVED notification for user ${userId} and plan ${planId}`);
                const userData = (yield user_schema_1.User.findById(userId).select("phone email userName settings").lean());
                // if(this.checkNotificationSettings(userData?.settings?.notifications, ENotificationMainTypes.PLAN, ENotificationChannel.WHATSAPP)){
                message_service_1.default.sendWhatsappMessage(userData.phone, `Dear ${(userData === null || userData === void 0 ? void 0 : userData.userName) || "User"}, \n Payment Approved for amount INR ${amount} for  transactionId: ${transactionId}.`);
                // }
                // if(this.checkNotificationSettings(userData?.settings?.notifications, ENotificationMainTypes.PLAN, ENotificationChannel.EMAIL)){
                emailService.sendNotificationMail(userData.email, "PAYMENT APPROVED", `Dear ${(userData === null || userData === void 0 ? void 0 : userData.userName) || "User"}, \n  Payment Approved for your transactionId  ${transactionId}.`);
                // }
            }
            catch (e) {
                logger_1.default.error(`Error sending  PAYMENT_APPROVED notification for user ${userId}  for  plan ${planId}`, e.message);
            }
        });
    }
    paymentRejected(userId, planId, amount, transactionId, reason = "some unknown issue") {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info(`Sending PAYMENT_REJECTED notification for user ${userId} and plan ${planId}`);
                const userData = (yield user_schema_1.User.findById(userId).select("phone email userName settings").lean());
                // if(this.checkNotificationSettings(userData?.settings?.notifications, ENotificationMainTypes.PLAN, ENotificationChannel.WHATSAPP)){
                message_service_1.default.sendWhatsappMessage(userData.phone, `Dear ${(userData === null || userData === void 0 ? void 0 : userData.userName) || "User"}, \n Payment Rejected for amount INR ${amount} for  transactionId: ${transactionId} due to "${reason}".`);
                // }
                // if(this.checkNotificationSettings(userData?.settings?.notifications, ENotificationMainTypes.PLAN, ENotificationChannel.EMAIL)){
                emailService.sendNotificationMail(userData.email, "PAYMENT REJECTED", `Dear ${(userData === null || userData === void 0 ? void 0 : userData.userName) || "User"}, \n  Payment Rejected for amount INR ${amount} for your transactionId  ${transactionId} due to "${reason}"`);
                // }
            }
            catch (e) {
                logger_1.default.error(`Error sending  PAYMENT_REJECTED notification for user ${userId}  for  plan ${planId}`, e.message);
            }
        });
    }
}
exports.NotifyService = NotifyService;
exports.default = new NotifyService();
//# sourceMappingURL=notify.service.js.map