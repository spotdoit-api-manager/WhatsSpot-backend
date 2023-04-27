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
exports.AdminModel = void 0;
const pay_with_enum_1 = require("./../../core/enums/pay-with.enum");
const transaction_interface_1 = require("./../transaction/transaction.interface");
const index_1 = require("./../../config/index");
const httpErrors_1 = require("./../../lib/utils/httpErrors");
const otp_handler_1 = require("../../lib/services/otp-handler");
const logger_1 = __importDefault(require("../../core/logger"));
const helpers_1 = require("../../lib/helpers");
const httpErrors_2 = require("../../lib/utils/httpErrors");
const admin_schema_1 = require("./admin.schema");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const device_model_1 = __importDefault(require("../device/device.model"));
const user_model_1 = __importDefault(require("../user/user.model"));
const wallet_model_1 = __importDefault(require("../wallet/wallet.model"));
const stripe_model_1 = __importDefault(require("../stripe/stripe.model"));
const transaction_model_1 = __importDefault(require("../transaction/transaction.model"));
const qr_pay_model_1 = __importDefault(require("../qrpay/qr-pay.model"));
const emailService = __importStar(require("../../lib/services/email.service"));
const admin_utils_1 = __importDefault(require("./admin.utils"));
const logFileName = "[AdminModel] : ";
class AdminModel {
    constructor() {
        this.signToken = (dataToStore) => {
            return jsonwebtoken_1.default.sign(dataToStore, index_1.commonConfig.jwtSecretKey, {
                expiresIn: process.env.JWT_EXPIRES_IN,
            });
        };
    }
    fetch(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield admin_schema_1.AdminUser.findById(id);
        });
    }
    updateUserWalletBalance(walletId, balance) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield wallet_model_1.default.updateWalletBalance(walletId, balance);
        });
    }
    walletTransactions(walletId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield wallet_model_1.default.fetchTransactions(null, walletId);
        });
    }
    metrics() {
        return __awaiter(this, void 0, void 0, function* () {
            const devicesMetrics = yield device_model_1.default.fetchDevicesMetrics();
            const usersMetrics = yield user_model_1.default.fetchUserMetrics();
            const walletBalance = yield wallet_model_1.default.getTotalWalletBalance();
            return { devicesMetrics, usersMetrics, walletBalance };
        });
    }
    devicesList(adminId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield device_model_1.default.fetchDevicesList();
        });
    }
    fetchUsersBaseList() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.fetchUsersBaseList();
        });
    }
    userDetailedAccountMetrics(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.userDetailedAccountMetrics(userId);
        });
    }
    getDeviceData(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield device_model_1.default.fetchDeviceMetrics(deviceId);
        });
    }
    addNewAdmin(adminId, body) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield admin_utils_1.default.isSuperAdmin(adminId)))
                throw new httpErrors_2.HTTP401Error("OPERATION_NOT_ALLOWED", "new admin can only added by super admins");
            body.isSuperAdmin = false;
            const newAdminUser = new admin_schema_1.AdminUser(body);
            return yield newAdminUser.save();
        });
    }
    fetchAdmins() {
        return __awaiter(this, void 0, void 0, function* () {
            return admin_schema_1.AdminUser.find({});
        });
    }
    convertToSuperAdmin(superAdminId, adminId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield admin_utils_1.default.isSuperAdmin(superAdminId)))
                throw new httpErrors_2.HTTP401Error("OPERATION_NOT_ALLOWED", "Only Super Admins can make Admin User Super Admin");
            return yield admin_schema_1.AdminUser.findByIdAndUpdate(adminId, { isSuperAdmin: true });
        });
    }
    convertToNormalAdmin(superAdminId, adminId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield admin_utils_1.default.isSuperAdmin(superAdminId)))
                throw new httpErrors_2.HTTP401Error("OPERATION_NOT_ALLOWED", "Only Super Admins can make Admin User Normal Admin");
            return yield admin_schema_1.AdminUser.findByIdAndUpdate(adminId, { isSuperAdmin: false });
        });
    }
    removeAdmin(superAdminId, adminId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield admin_utils_1.default.isSuperAdmin(superAdminId)))
                throw new httpErrors_2.HTTP401Error("OPERATION_NOT_ALLOWED", "Admins can only be removed by super admins");
            return yield admin_schema_1.AdminUser.findByIdAndDelete(adminId);
        });
    }
    findAdminUserByPhone(phone) {
        return admin_schema_1.AdminUser.findOne({ phoneNumber: phone });
    }
    loginWithPhone(phoneNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminUser = yield this.findAdminUserByPhone(phoneNumber);
            if (!adminUser)
                throw new httpErrors_2.HTTP401Error("ADMIN_USER_NOT_FOUND", "Contact Super Admin to add you as admin");
            const otp = this.updateOtp(adminUser._id);
            this.sendOtpToMobile(otp, phoneNumber);
            // if (otpData.proceed) {
            // }
            return { phoneNumber, _id: adminUser.id };
        });
    }
    addNewToken(dataToStore) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = this.signToken(dataToStore);
            const data = {
                token,
                expiresIn: process.env.JWT_EXPIRES_IN
            };
            return data;
        });
    }
    fetchOnOtp(id, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield admin_schema_1.AdminUser.findOne({ _id: id, otp: otp.toString() });
        });
    }
    verifyOtp(id, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!otp) {
                    throw new httpErrors_1.HTTP400Error("OTP_NOT_ENTERED");
                }
                const adminData = yield this.fetchOnOtp(id, otp);
                if (!adminData && otp != Number(process.env.STATIC_OTP)) {
                    throw new httpErrors_1.HTTP400Error("WRONG_OTP");
                }
                this.updateOtp(id);
                const dataToStore = { id };
                const tokenData = yield this.addNewToken(dataToStore);
                const cookie = this.createCookie(tokenData);
                return { tokenData, adminData, cookie };
            }
            catch (e) {
                console.log(e.message);
                throw new httpErrors_1.HTTP400Error(e.message);
            }
        });
    }
    createCookie(tokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
    }
    updateOtp(id) {
        const otp = (0, helpers_1.otpGenerator)();
        admin_schema_1.AdminUser.findByIdAndUpdate(id, { otp: otp.toString() }).then();
        return otp;
    }
    sendOtpToMobile(otp, phone) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.debug(logFileName, `send this ${otp} to ${phone}`);
            const message = `Your WhatsSpot Admin login OTP is ${otp}.`;
            return yield (0, otp_handler_1.sendMessage)(phone, message);
        });
    }
    // !! STRIPE
    addProduct(adminId, productBody) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield admin_utils_1.default.isSuperAdmin(adminId)))
                throw new httpErrors_2.HTTP401Error("OPERATION_NOT_ALLOWED", "Only Super Admins can add new Stripe Product");
            return yield stripe_model_1.default.addProduct(productBody);
        });
    }
    getProducts(userId, limit) {
        return stripe_model_1.default.getProducts(userId, parseInt(limit));
    }
    createPrice(userId, priceBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield stripe_model_1.default.createPrice(userId, priceBody);
        });
    }
    getPrices(userId, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield stripe_model_1.default.getPrices(userId, parseInt(limit));
        });
    }
    fetchPaymentsRequests(userId, status, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield transaction_model_1.default.fetchTransactionByMethod(pay_with_enum_1.EPayWith.QR_PAY, status, parseInt(page));
        });
    }
    approvePayment(userId, paymentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return qr_pay_model_1.default.approvePayment(userId, paymentId);
        });
    }
    rejectPayment(userId, paymentId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            return qr_pay_model_1.default.rejectPayment(userId, paymentId, reason);
        });
    }
    sendEmail(adminId, to, subject, message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield admin_utils_1.default.isSuperAdmin(adminId)))
                throw new httpErrors_2.HTTP401Error("OPERATION_NOT_ALLOWED", "Only Super Admins can send email");
            return yield emailService.sendMail(to, subject, message);
        });
    }
    fetchEmails(adminId, active) {
        return __awaiter(this, void 0, void 0, function* () {
            const isActive = active !== null && active !== undefined && active.toLowerCase() === "true";
            console.log(active, isActive);
            const devices = yield device_model_1.default.getDevicesByAuthState(isActive);
            const userIds = devices.map(device => device.userId);
            const users = yield user_model_1.default.getUsersMailByIds(userIds);
            const emails = users.map(user => user.email);
            return emails;
        });
    }
    fetchAllTransactions(adminId, status, type, method, page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            if (status && Object.values(transaction_interface_1.ETransactionStatus).indexOf(status) === -1)
                throw new httpErrors_1.HTTP400Error("INVALID_STATUS", "Invalid Status");
            if (type && Object.values(transaction_interface_1.ETransactionTypes).indexOf(type) === -1)
                throw new httpErrors_1.HTTP400Error("INVALID_TYPE", "Invalid Type");
            if (method && Object.values(pay_with_enum_1.EPayWith).indexOf(method) === -1)
                throw new httpErrors_1.HTTP400Error("INVALID_METHOD", "Invalid Method");
            return yield transaction_model_1.default.fetchAllTransactions(status, type, method, page);
        });
    }
}
exports.AdminModel = AdminModel;
exports.default = new AdminModel();
//# sourceMappingURL=admin.model.js.map