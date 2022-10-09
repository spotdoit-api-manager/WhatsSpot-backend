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
exports.UserModel = void 0;
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const index_1 = require("./../../lib/utils/index");
const phone_handler_1 = require("./../../lib/utils/phone.handler");
const message_interface_1 = require("./../messages/message.interface");
const helpers_1 = require("../../lib/helpers");
const user_schema_1 = require("./user.schema");
const bcrypt = __importStar(require("bcryptjs"));
const otp_handler_1 = require("../../lib/services/otp-handler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bson_1 = require("bson");
const config_1 = require("../../config");
const httpErrors_1 = require("../../lib/utils/httpErrors");
const wallet_model_1 = __importDefault(require("../wallet/wallet.model"));
const logger_1 = __importDefault(require("../../core/logger"));
const plans_interface_1 = require("../plans/plans.interface");
const notify_service_1 = __importDefault(require("../../lib/services/notify.service"));
const emailService = __importStar(require("../../lib/services/email.service"));
const logFileName = "[UserModal] : ";
class UserModel {
    constructor() {
        this.signToken = (dataToStore) => {
            return jsonwebtoken_1.default.sign(dataToStore, config_1.commonConfig.jwtSecretKey, {
                expiresIn: process.env.JWT_EXPIRES_IN,
            });
        };
    }
    fetchAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = user_schema_1.User.find();
            return data;
        });
    }
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_schema_1.User.findById(userId);
            return user;
        });
    }
    fetchUserMetrics() {
        return __awaiter(this, void 0, void 0, function* () {
            const totalUsers = yield user_schema_1.User.countDocuments();
            return { totalUsers };
        });
    }
    fetch(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield user_schema_1.User.aggregate([
                { $match: { _id: new bson_1.ObjectID(id) } },
                {
                    $lookup: {
                        from: "wallets",
                        localField: "walletId",
                        foreignField: "_id",
                        as: "wallet"
                    },
                },
                {
                    $unwind: {
                        path: "$wallet"
                    }
                }
            ]);
            return data[0];
        });
    }
    update(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield user_schema_1.User.findByIdAndUpdate(id, body, {
                runValidators: true,
                new: true
            });
            return data;
        });
    }
    fetchUserDetailedActivePlan(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userPlan = yield user_schema_1.User.aggregate([
                { $match: { _id: new bson_1.ObjectID(userId) } },
                {
                    $project: {
                        activePlan: { $arrayElemAt: ["$activePlans", 0] }
                    }
                },
                {
                    $lookup: {
                        from: "userplans",
                        localField: "activePlan.planRef",
                        foreignField: "_id",
                        as: "activePlanInfo"
                    },
                },
                {
                    $project: {
                        activePlanInfo: { $arrayElemAt: ["$activePlanInfo", 0] }
                    }
                },
                {
                    $lookup: {
                        from: "plans",
                        localField: "activePlanInfo.planId",
                        foreignField: "planId",
                        as: "planInfo"
                    },
                },
                {
                    $project: {
                        planInfo: { $arrayElemAt: ["$planInfo", 0] },
                        activePlanInfo: 1
                    }
                },
            ]);
            if (userPlan[0] && userPlan[0].activePlanInfo) {
                return userPlan[0];
            }
            throw new httpErrors_1.HTTP401Error("NO_ACTIVE_PLAN", "You don't have any active plan to show");
        });
    }
    fetchUserActivePlan(userId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const userPlan = yield user_schema_1.User.aggregate([
                { $match: { _id: new bson_1.ObjectID(userId) } },
                { $project: {
                        _id: 1,
                        activePlans: 1
                    } },
                {
                    $unwind: {
                        path: "$activePlans"
                    }
                },
                {
                    $lookup: {
                        from: "userplans",
                        let: { planRef: "$activePlans.planRef" },
                        pipeline: [
                            {
                                $match: {
                                    planStatus: { $in: [plans_interface_1.EPlanStatus.ACTIVE, plans_interface_1.EPlanStatus.EXHAUSTED] },
                                    $expr: {
                                        $eq: ["$_id", "$$planRef"],
                                    }
                                }
                            }
                        ],
                        as: "activePlan"
                    },
                },
            ]);
            return ((_a = userPlan[0]) === null || _a === void 0 ? void 0 : _a.activePlan[0]) || null;
        });
    }
    addPlanToUser(userId, activePlanName, activePlanId) {
        return __awaiter(this, void 0, void 0, function* () {
            const planRef = { planName: activePlanName, planRef: activePlanId };
            const result = yield user_schema_1.User.findByIdAndUpdate(userId, { $push: { activePlans: planRef } });
            notify_service_1.default.planActivated(userId, activePlanId);
        });
    }
    removeUserActivePlan(userId, planRef) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(logFileName, `removeUserActivePlan : ${userId} PlanRef: ${planRef}`);
            const userData = yield user_schema_1.User.findByIdAndUpdate(userId, { $pull: { activePlans: { planRef: new bson_1.ObjectID(planRef) } } }, { new: false }).lean();
            const activePlan = userData.activePlans.find(plan => plan.planRef.toString() === planRef);
            yield user_schema_1.User.findByIdAndUpdate(userId, { $push: { previousPlans: activePlan } });
        });
    }
    checkIfUserCanActivatePlan(userId, planId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (planId == plans_interface_1.EPLANS.PAYG) {
                return true;
            }
            const userActivePlan = yield this.fetchUserActivePlan(userId);
            if (userActivePlan && userActivePlan.planStatus === plans_interface_1.EPlanStatus.ACTIVE) {
                throw new httpErrors_1.HTTP400Error("ALREADY_HAS_ACTIVE_PLAN", "User already has an active plan");
            }
            else if (userActivePlan && userActivePlan.planStatus === plans_interface_1.EPlanStatus.EXHAUSTED) {
                yield this.removeUserActivePlan(userId, userActivePlan._id);
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield user_schema_1.User.deleteOne({ _id: id });
        });
    }
    add(body) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('User Info While Adding new User', body);
            if (body.password) {
                body.password = yield bcrypt.hash(body.password, 12);
            }
            const q = new user_schema_1.User(body);
            const data = yield q.addNewUser();
            return { _id: data._id };
        });
    }
    createNewUser(phone, email, userName, country) {
        return __awaiter(this, void 0, void 0, function* () {
            let walletId = null;
            try {
                const body = { phone, email, userName, country, emailVerified: false, isVerified: false, deactivation: false, role: "user", };
                const existingUser = yield this.isUserExistByPhone(body.phone);
                let data;
                if (!existingUser) {
                    const wallet = yield wallet_model_1.default.createWallet(parseInt(process.env.INITIAL_WALLET_BALANCE));
                    body.walletId = wallet._id;
                    walletId = wallet._id;
                    const newUser = new user_schema_1.User(body);
                    data = yield newUser.addNewUser();
                    if (!data)
                        throw new httpErrors_1.HTTP400Error("SOME_ERROR_OCCURED");
                    yield wallet_model_1.default.addUserToWallet(data.walletId, data._id);
                    return data;
                }
                return existingUser;
            }
            catch (err) {
                wallet_model_1.default.deleteWallet(walletId);
                throw new httpErrors_1.HTTP400Error(err.message);
            }
        });
    }
    registerWithPhone(phone, email, userName, country) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!phone || !email || !userName || !country)
                    throw new httpErrors_1.HTTP400Error("Fields missing or empty { phone,email,userName,country} are required fields");
                if (!(0, index_1.validateEmail)(email))
                    throw new httpErrors_1.HTTP400Error("INVALID_EMAIL", "Please enter valid email id");
                const phoneInfo = (0, phone_handler_1.parsePhoneWithCountry)(phone, country);
                logger_1.default.info("Phone Info is ", phoneInfo);
                const userExist = yield this.findUserByPhone(phoneInfo.number);
                if (userExist && userExist.isVerified)
                    throw new httpErrors_1.HTTP401Error("USER_ALREADY_EXIST");
                if (userExist && !userExist.isVerified) {
                    const otp = this.updateOtp(userExist._id);
                    const otpData = yield this.sendOtpToMobile(otp, phoneInfo.number);
                    if (otpData === null || otpData === void 0 ? void 0 : otpData.proceed) {
                        return { phone: phoneInfo.number, _id: userExist.id };
                    }
                }
                else {
                    const user = yield this.createNewUser(phoneInfo.number, email, userName, country);
                    const otp = this.updateOtp(user._id);
                    const otpData = yield this.sendOtpToMobile(otp, phoneInfo.number);
                    if (otpData === null || otpData === void 0 ? void 0 : otpData.proceed) {
                        return { phone: phoneInfo.number, _id: user.id };
                    }
                }
                throw new httpErrors_1.HTTP400Error("SOME_ERROR_OCCURRED");
            }
            catch (e) {
                logger_1.default.error(logFileName, e);
                if (e.code == 11000) {
                    throw new httpErrors_1.HTTP400Error(e.keyPattern.email ? "EMAIL_ALREADY_REGISTERED" : "PHONE_ALREADY_REGISTERED");
                }
                throw new httpErrors_1.HTTP400Error(e.message);
            }
        });
    }
    loginWithPhone(phone, country) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsedPhone = (0, phone_handler_1.parsePhoneWithCountry)(phone, country).number;
            const user = yield this.findUserByPhone(parsedPhone);
            if (!user)
                throw new httpErrors_1.HTTP401Error("USER_NOT_FOUND");
            const otp = this.updateOtp(user._id);
            const otpData = yield this.sendOtpToMobile(otp, parsedPhone);
            if (otpData.proceed) {
                return { phone: parsedPhone, _id: user.id };
            }
        });
    }
    resendOTP(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsedPhone = (0, phone_handler_1.parsePhoneWithCountry)(body.phoneNumber, body.country);
            const user = yield user_schema_1.User.findOne({ _id: new bson_1.ObjectID(id), phone: parsedPhone.number });
            if (!user)
                throw new httpErrors_1.HTTP401Error("USER_NOT_FOUND");
            const otp = this.updateOtp(user._id);
            const otpData = yield this.sendOtpToMobile(otp, body.phone);
            if (otpData.proceed) {
                return { phone: body.phone, _id: user.id };
            }
        });
    }
    findUserByPhone(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_schema_1.User.findOne({ phone });
        });
    }
    signUp(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.isUserExist(body);
                body.role = "user";
                const data = yield this.add(body);
                const userData = yield this.addNewToken(data._id);
                return userData;
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e.message);
            }
        });
    }
    isUserExist(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userName, password } = body;
                // 1>  check email and password exist
                if (!userName || !password) {
                    throw new httpErrors_1.HTTP400Error("Please provide userName or password");
                }
                // 2> check if user exist and password is correct
                const user = yield user_schema_1.User.findOne({ userName: userName }).select("+password");
                if (user) {
                    throw new httpErrors_1.HTTP400Error("Invalid userName or password");
                }
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e.message);
            }
        });
    }
    login(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userName, password } = body;
                // 1>  check email and password exist
                if (!userName || !password) {
                    throw new httpErrors_1.HTTP400Error("Please provide userName or password");
                }
                // 2> check if user exist and password is correct
                const user = yield user_schema_1.User.findOne({ userName: userName }).select("+password");
                if (!user || !(yield user.correctPassword(password, user.password))) {
                    throw new httpErrors_1.HTTP400Error("Invalid email or password");
                }
                // 3> if eveything is ohkay send the token back
                const userData = yield this.addNewToken(user._id);
                return userData;
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e.message);
            }
        });
    }
    verifyUser(otp, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log("verify user ", userId, otp);
            return { proceed: true };
        });
    }
    isUserExistByPhone(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_schema_1.User.findOne({ phone: phone }).lean();
            return user;
        });
    }
    authenticateWithAccesToken(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //, { appleSub: data.id }
                console.log(data);
                const userInfo = yield user_schema_1.User.findOne({ $or: [{ $and: [{ email: { $ne: null } }, { email: { $eq: data.email } }] }, { $and: [{ facebookId: { $ne: null } }, { facebookId: { $eq: data.id } }] }] });
                console.log("User At Social Auth :", userInfo);
                if (userInfo) {
                    console.log(userInfo);
                    console.log(userInfo, "User info here");
                    // let token = await this.addNewToken(userInfo._id, userInfo);
                    return { userInfo, isExisted: true };
                }
                else {
                    return { data, isExisted: false };
                }
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e);
            }
        });
    }
    updateOtp(id) {
        const otp = (0, helpers_1.otpGenerator)();
        user_schema_1.User.findByIdAndUpdate(id, { otp }).then();
        return otp;
    }
    updateDeviceCode(userId, phone) {
        return __awaiter(this, void 0, void 0, function* () {
            const code = (0, helpers_1.otpGenerator)();
            const key = `deviceCodes.${phone}`;
            const data = yield user_schema_1.User.findByIdAndUpdate(userId, { [key]: code });
            return code;
        });
    }
    validateDeviceCode(userId, devicePhone, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = `deviceCodes.${devicePhone}`;
            const data = yield user_schema_1.User.findOne({ "_id": new bson_1.ObjectID(userId), [key]: code });
            if (!data)
                throw new httpErrors_1.HTTP400Error("INVALID_CODE", "The code you have entered is invalid");
        });
    }
    sendOtpToMobile(otp, phone) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.debug(logFileName, `send this ${otp} to ${phone}`);
            const message = `Your WhatsSpot login OTP is ${otp}. Please do not share it with anyone.`;
            return yield (0, otp_handler_1.sendMessage)(phone, message);
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
            return yield user_schema_1.User.findOne({ _id: id, otp });
        });
    }
    verifyOtp(id, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!otp) {
                    throw new httpErrors_1.HTTP400Error("OTP not entered");
                }
                const otpData = yield this.fetchOnOtp(id, otp);
                if (otp == Number(process.env.STATIC_OTP)) {
                }
                else if (!otpData) {
                    throw new httpErrors_1.HTTP400Error("WRONG_OTP");
                }
                this.updateOtp(id);
                const wallet = yield wallet_model_1.default.fetchWalletByUserId(id);
                const data = yield user_schema_1.User.findOneAndUpdate({ _id: new bson_1.ObjectID(id) }, { $set: { isVerified: true, walletId: wallet._id, } }, { new: true });
                const dataToStore = { id, walletId: wallet._id };
                const tokenData = yield this.addNewToken(dataToStore);
                const cookie = this.createCookie(tokenData);
                return { tokenData, data, cookie };
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
    generateValiduserName(firstName, id = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let s = this.randomString(6);
            let userName = `${firstName}_${s}`;
            if (id == null) {
                while ((yield user_schema_1.User.findOne({ "userName": userName }).count()) > 0) {
                    s = this.randomString(6);
                    userName = `${firstName}_${s}`;
                }
            }
            else {
                while ((yield user_schema_1.User.findOne({ _id: { $ne: id }, "userName": userName }).count()) > 0) {
                    s = this.randomString(6);
                    userName = `${firstName}_${s}`;
                }
            }
            return userName;
        });
    }
    randomString(length) {
        return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
    }
    genrateOTP(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = (0, helpers_1.otpGenerator)();
            const res = yield this.sendOtpToMobile(otp, phone);
            if (res.proceed) {
                return { res, proceed: true };
            }
            return { proceed: false };
        });
    }
    addPhoneNumber(id, phone) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(id);
                const user = yield user_schema_1.User.findById(id);
                console.log(user);
                if (!user) {
                    throw new httpErrors_1.HTTP400Error("User does not exist");
                }
                if (user.phone == null) {
                    yield user_schema_1.User.findOneAndUpdate({ _id: id }, {
                        $set: { phone: phone }
                    });
                }
                const otp = yield this.updateOtp(id);
                const otpData = yield this.sendOtpToMobile(otp, phone);
                console.log(otpData);
                if (otpData.proceed) {
                    return { _id: user._id, isExisted: true };
                }
                else {
                    throw new httpErrors_1.HTTP400Error("Unable to Send OTP");
                }
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e.message);
            }
        });
    }
    isUserVerified(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_schema_1.User.findById(id);
            if (user.isVerified) {
                return { proceed: true, phone: user.phone };
            }
            return { proceed: false };
        });
    }
    getAccountMetrics(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("user id is ", userId);
            const result = yield user_schema_1.User.aggregate([
                { $match: { _id: new bson_1.ObjectID(userId) } },
                { $set: { _id: { $toObjectId: "$_id" } } },
                {
                    $project: {
                        _id: 1
                    }
                },
                {
                    $lookup: {
                        from: "devices",
                        // localField: "_id",
                        // foreignField: "userId",
                        let: { userId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    "isDeleted.status": false,
                                    $expr: {
                                        $eq: ["$userId", "$$userId"],
                                    }
                                }
                            }
                        ],
                        as: "devices"
                    },
                },
                {
                    $unwind: {
                        path: "$devices"
                    }
                },
                {
                    $project: {
                        deviceId: "$devices._id",
                        authState: "$devices.authState"
                    }
                },
                { $set: { deviceId: { $toString: "$deviceId" } } },
                {
                    $lookup: {
                        from: "fastmessages",
                        localField: "deviceId",
                        foreignField: "deviceId",
                        as: "fastMessages"
                    },
                },
                {
                    $lookup: {
                        from: "messagequeues",
                        localField: "deviceId",
                        foreignField: "deviceId",
                        as: "queueMessages"
                    },
                },
                {
                    $project: {
                        deviceId: "$deviceId",
                        authState: "$authState",
                        metrics: {
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
                        }
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        totalDevices: { $sum: 1 },
                        activeDevices: {
                            "$sum": {
                                "$cond": [
                                    { "$eq": ["$authState", true] },
                                    1,
                                    0
                                ]
                            }
                        },
                        totalFastSuccess: { $sum: "$metrics.totalFastSuccess" },
                        totalFastError: { $sum: "$metrics.totalFastError" },
                        totalQueueSuccess: { $sum: "$metrics.totalQueueSuccess" },
                        totalQueueError: { $sum: "$metrics.totalQueueError" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        userId: "$_id",
                        metrics: {
                            activeDevices: "$activeDevices",
                            totalDevices: "$totalDevices",
                            totalFastSuccess: "$totalFastSuccess",
                            totalFastError: "$totalFastError",
                            totalQueueSuccess: "$totalQueueSuccess",
                            totalQueueError: "$totalQueueError"
                        }
                    }
                }
            ]);
            return result[0] || null;
        });
    }
    fetchUsersBaseList() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_schema_1.User.aggregate([
                { $match: {} },
                {
                    $lookup: {
                        from: "devices",
                        let: { userId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$userId", "$$userId"],
                                    }
                                }
                            }
                        ],
                        as: "totalDevices"
                    },
                },
                {
                    $lookup: {
                        from: "userplans",
                        let: { userId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$userId", "$$userId"],
                                    }
                                }
                            }
                        ],
                        as: "plans"
                    },
                },
                {
                    $lookup: {
                        from: "devices",
                        let: { userId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    "isDeleted.status": true,
                                    $expr: {
                                        $eq: ["$userId", "$$userId"],
                                    }
                                }
                            }
                        ],
                        as: "deletedDevices"
                    },
                },
                {
                    $lookup: {
                        from: "devices",
                        let: { userId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    authState: true,
                                    $expr: {
                                        $eq: ["$userId", "$$userId"],
                                    }
                                }
                            }
                        ],
                        as: "activeDevices"
                    },
                },
                {
                    $lookup: {
                        from: "devices",
                        let: { userId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    authState: false,
                                    $expr: {
                                        $eq: ["$userId", "$$userId"],
                                    }
                                }
                            }
                        ],
                        as: "inactiveDevices"
                    },
                },
                {
                    $lookup: {
                        from: "wallets",
                        let: { userId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$userId", "$$userId"],
                                    }
                                }
                            },
                            {
                                $project: {
                                    balance: 1,
                                }
                            }
                        ],
                        as: "wallet"
                    },
                },
                { $addFields: { totalDevices: { $size: "$totalDevices", } }, },
                { $addFields: { deletedDevices: { $size: "$deletedDevices", } } },
                { $addFields: { activeDevices: { $size: "$activeDevices", } } },
                { $addFields: { inactiveDevices: { $size: "$inactiveDevices", } } },
                { $addFields: { wallet: { $arrayElemAt: ["$wallet", 0] } } },
                {
                    $project: {
                        phone: 1,
                        email: 1,
                        totalDevices: 1,
                        deletedDevices: 1,
                        activeDevices: 1,
                        inactiveDevices: 1,
                        createdAt: 1,
                        isVerified: 1,
                        deactivation: 1,
                        walletId: 1,
                        walletBalance: "$wallet.balance",
                        hasActivePlan: {
                            $size: {
                                $filter: {
                                    input: "$plans",
                                    as: "plans",
                                    cond: { "$eq": ["$$plans.planStatus", plans_interface_1.EPlanStatus.ACTIVE] }
                                }
                            }
                        },
                    }
                }
            ]);
        });
    }
    userDetailedAccountMetrics(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_schema_1.User.aggregate([
                { $match: { _id: new bson_1.ObjectID(userId) } },
                { $set: { _id: { $toObjectId: "$_id" } } },
                {
                    $lookup: {
                        from: "devices",
                        let: { userId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    // "isDeleted.status": false,
                                    $expr: {
                                        $eq: ["$userId", "$$userId"],
                                    }
                                }
                            },
                            {
                                $project: {
                                    apiKeys: 0,
                                }
                            }
                        ],
                        as: "devices"
                    },
                },
                {
                    $lookup: {
                        from: "userplans",
                        let: { userId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$userId", "$$userId"],
                                    }
                                }
                            }
                        ],
                        as: "plans"
                    },
                },
                {
                    $lookup: {
                        from: "wallets",
                        let: { userId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$userId", "$$userId"],
                                    }
                                },
                            },
                            {
                                $project: {
                                    _id: 0,
                                    walletId: "$_id",
                                    balance: 1,
                                    createdAt: 1,
                                    updatedAt: 1,
                                }
                            }
                        ],
                        as: "wallet"
                    },
                },
                {
                    $project: {
                        _id: 0,
                        userInfo: {
                            userId: "$_id",
                            isVerified: "$isVerified",
                            deactivation: "$deactivation",
                            phone: "$phone",
                            email: "$email",
                            waletId: "$walletId",
                            previousPlans: "$previousPlans",
                            createdAt: "$createdAt",
                            updatedAt: "$updatedAt",
                        },
                        walletInfo: { $arrayElemAt: ["$wallet", 0] },
                        devices: 1,
                        plans: 1
                    }
                }
            ]);
        });
    }
    updateNotificationSettings(userId, notificationSetting) {
        return __awaiter(this, void 0, void 0, function* () {
            const newSettings = {
                device: Object.assign({}, notificationSetting.device),
                plan: Object.assign({}, notificationSetting.plan)
            };
            return yield user_schema_1.User.findOneAndUpdate({ _id: new bson_1.ObjectID(userId) }, { $set: { "settings.notifications": newSettings } }, { new: true }).select("settings.notifications").lean();
        });
    }
    updateProfile(userId, profileBody) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!profileBody.country || !profileBody.userName)
                throw new httpErrors_1.HTTP400Error("Invalid request", "country and userName are required");
            return yield user_schema_1.User.findByIdAndUpdate(userId, { country: profileBody.country, userName: profileBody.userName }, { new: true }).lean();
        });
    }
    sendEmailVerification(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findUserById(userId);
            if (user.emailVerified)
                throw new httpErrors_1.HTTP401Error("EMAIL_ALREADY_VERIFIED", "Your email id is already verified");
            if (!user)
                throw new httpErrors_1.HTTP400Error("USER_NOT_FOUND", "User not found");
            const email = user.email;
            if (!email)
                throw new httpErrors_1.HTTP400Error("USER_EMAIL_FOUND", "User do not have email");
            const otp = (0, helpers_1.otpGenerator)();
            logger_1.default.info(logFileName, `Sending Email OTP ${otp} to ${email}`);
            yield user_schema_1.User.findByIdAndUpdate(userId, { $set: { emailOtp: otp } });
            const res = yield emailService.sendVerificationMail(email, "Email Verification", `Dear ${(user === null || user === void 0 ? void 0 : user.userName) || "User"}, Your OTP for email verification is <b><h2>${otp}</h2></h2></b><br><br> Please do not share this with anyone.`, `Dear ${user.userName}, Your OTP for email verification is <b><h2>${otp}</h2></h2></b>Please do not share this with anyone.`);
            if (!res)
                throw new httpErrors_1.HTTP400Error("EMAIL_SEND_FAILED", "Email send failed");
        });
    }
    verifyEmailOtp(userId, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findUserById(userId);
            if (!user)
                throw new httpErrors_1.HTTP400Error("USER_NOT_FOUND", "User not found");
            if (user.emailVerified)
                throw new httpErrors_1.HTTP400Error("EMAIL_ALREADY_VERIFIED", "Your email id is already verifeid");
            if (!user.emailOtp)
                throw new httpErrors_1.HTTP400Error("EMAIL_OTP_NOT_FOUND", "Email OTP not found");
            if (user.emailOtp !== parseInt(otp))
                throw new httpErrors_1.HTTP400Error("INVALID_OTP", "The entered OTP is invalid");
            return yield user_schema_1.User.findByIdAndUpdate(userId, { $set: { emailVerified: true } }).lean();
        });
    }
    getUserById(userId) {
        return user_schema_1.User.findById(userId);
    }
}
exports.UserModel = UserModel;
exports.default = new UserModel();
//# sourceMappingURL=user.model.js.map