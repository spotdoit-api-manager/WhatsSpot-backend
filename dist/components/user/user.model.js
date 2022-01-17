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
exports.UserModel = void 0;
const helpers_1 = require("../../lib/helpers");
const user_schema_1 = require("./user.schema");
const socialAuth_1 = __importDefault(require("./../../lib/middleware/socialAuth"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const textlocal_1 = require("./../../lib/services/textlocal");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bson_1 = require("bson");
const config_1 = require("../../config");
const httpErrors_1 = require("../../lib/utils/httpErrors");
class UserModel {
    constructor() {
        // private async generateValidUsername(firstName: string, id: string | null = null) {
        //   let s = this.randomString(6);
        //   let userName = `${firstName}_${s}`
        //   if (id == null) {
        //     while ((await User.findOne({ "userName": userName }).count()) > 0) {
        //       s = this.randomString(6);
        //       userName = `${firstName}_${s}`
        //     }
        //   } else {
        //     while ((await User.findOne({ _id: { $ne: id }, "userName": userName }).count()) > 0) {
        //       s = this.randomString(6);
        //       userName = `${firstName}_${s}`
        //     }
        //   }
        //   return userName;
        // }
        this.signToken = (id) => {
            return jsonwebtoken_1.default.sign({ id }, config_1.commonConfig.jwtSecretKey, {
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
    fetch(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = user_schema_1.User.findById(id);
            return data;
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
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield user_schema_1.User.deleteOne({ _id: id });
        });
    }
    add(body) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('User Info While Adding new User', body);
            if (body.password) {
                body.password = yield bcrypt_1.default.hash(body.password, 12);
            }
            const q = new user_schema_1.User(body);
            const data = yield q.addNewUser();
            return { _id: data._id };
        });
    }
    registerWithPhone(body) {
        return __awaiter(this, void 0, void 0, function* () {
            body.role = "user";
            console.log("register with phone ", body);
            try {
                const existingUser = yield this.isUserExistByPhone(body.phone);
                let data;
                if (!existingUser) {
                    const newUser = new user_schema_1.User(body);
                    data = yield newUser.addNewUser();
                    if (!data)
                        throw new httpErrors_1.HTTP400Error("SOME_ERROR_OCCURED");
                }
                const otp = this.updateOtp((data === null || data === void 0 ? void 0 : data._id) || existingUser._id);
                const otpData = yield this.sendOtpToMobile(otp, body.phone);
                if (otpData.proceed) {
                    return { phone: body.phone, _id: (data === null || data === void 0 ? void 0 : data._id) || existingUser._id };
                }
                throw new httpErrors_1.HTTP400Error("OTP_NOT_SENT");
            }
            catch (e) {
                console.log(e);
                if (e.code == 11000) {
                    throw new httpErrors_1.HTTP400Error(e.keyPattern.email ? "EMAIL_ALREADY_REGISTERED" : "PHONE_ALREADY_REGISTERED");
                }
                throw new httpErrors_1.HTTP400Error(e.message);
            }
        });
    }
    signUp(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.isUserExist(body);
                // const user = await User.findOne({ phone: body.phone });
                body.role = 'user';
                let data = yield this.add(body);
                // const otp = this.updateOtp(data._id);
                // console.log(otp);
                // let otpData;
                // otpData = await this.sendOtpToMobile(otp, body.phone);
                // console.log(otpData);
                // if (otpData.proceed) {
                //   return { _id: data._id, isExisted: false };
                // } else {
                //   throw new HTTP400Error("Unable to Send OTP");
                // }
                const userData = yield this.addNewToken(data._id);
                return userData;
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e.message);
            }
        });
    }
    ;
    isUserExist(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = body;
                // 1>  check email and password exist
                if (!username || !password) {
                    throw new httpErrors_1.HTTP400Error('Please provide username or password');
                }
                // 2> check if user exist and password is correct
                const user = yield user_schema_1.User.findOne({ username: username }).select('+password');
                if (user) {
                    throw new httpErrors_1.HTTP400Error('Invalid username or password');
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
                const { username, password } = body;
                // 1>  check email and password exist
                if (!username || !password) {
                    throw new httpErrors_1.HTTP400Error('Please provide username or password');
                }
                // 2> check if user exist and password is correct
                const user = yield user_schema_1.User.findOne({ username: username }).select('+password');
                if (!user || !(yield user.correctPassword(password, user.password))) {
                    throw new httpErrors_1.HTTP400Error('Invalid email or password');
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
    ;
    verifyUser(otp, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("verify user ", userId, otp);
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
                let userInfo = yield user_schema_1.User.findOne({ $or: [{ $and: [{ email: { $ne: null } }, { email: { $eq: data.email } }] }, { $and: [{ facebookId: { $ne: null } }, { facebookId: { $eq: data.id } }] }] });
                console.log('User At Social Auth :', userInfo);
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
    loginViaSocialAccessToken(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user;
                if (body.authProvider === 'google') {
                    user = yield socialAuth_1.default.getGoogleUserInfo(body.access_token);
                }
                else if (body.authProvider === 'facebook') {
                    user = yield socialAuth_1.default.getFacebookUserInfo(body.access_token);
                }
                else if (body.authProvider === 'apple') {
                    // user = await socialAuth.verifyAppleUserInfo(body);
                }
                console.log('Login Info as Fetched By Auth Provider : ', user);
                let response = yield this.authenticateWithAccesToken(user);
                if (!response.isExisted) {
                    let u;
                    let userName = yield this.generateValidUsername(user.given_name);
                    if (body.authProvider === 'facebook') {
                        u = {
                            role: 'user',
                            firstName: `${user.given_name}`,
                            username: userName,
                            lastName: `${user.family_name}`,
                            phone: body.phone,
                            facebookId: user.id
                        };
                    }
                    else if (body.authProvider === 'google') {
                        console.log(user);
                        u = {
                            role: 'user',
                            firstName: `${user.given_name}`,
                            username: userName,
                            lastName: `${user.family_name}`,
                            phone: body.phone,
                            email: user.email,
                        };
                    }
                    const data = yield this.add(u);
                    const userData = yield this.addNewToken(data._id);
                    return userData;
                }
                else {
                    const userData = yield this.addNewToken(response.userInfo._id);
                    return userData;
                }
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e.message);
            }
        });
    }
    addFollower(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = user_schema_1.User.findOneAndUpdate({ id: userId }, {
                $push: { "followers": id }
            });
            return data;
        });
    }
    ;
    addFollowing(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = user_schema_1.User.findOneAndUpdate({ _id: userId }, {
                $push: { "following": id }
            });
            return data;
        });
    }
    ;
    addFollowRequest(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = user_schema_1.User.findOneAndUpdate({ id: userId }, {
                $push: { "followRequest": id }
            });
            return data;
        });
    }
    ;
    acceptFollowRequest(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield user_schema_1.User.findOneAndUpdate({ id: userId }, {
                $pull: { "followRequest": id }
            });
            if (data) {
                yield user_schema_1.User.findOneAndUpdate({ id: userId }, {
                    $push: { "followRequest": id }
                });
                yield user_schema_1.User.findOneAndUpdate({ id }, {
                    $push: { "following": userId }
                });
            }
            return data;
        });
    }
    ;
    updateOtp(id) {
        console.log("New OTP");
        const otp = helpers_1.otpGenerator();
        user_schema_1.User.findByIdAndUpdate(id, { otp }).then();
        return otp;
    }
    sendOtpToMobile(otp, phone) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`send this ${otp} to ${phone}`);
            const message = `Your SpotDoit Services login OTP is ${otp}.`;
            return textlocal_1.sendMessage(phone, message);
        });
    }
    addNewToken(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // const user = await User.findById(id);
            const token = this.signToken(id);
            // console.log(ikcbalance);
            // console.log(user);
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
                let data;
                data = yield this.fetchOnOtp(id, otp);
                if (!data) {
                    throw new httpErrors_1.HTTP400Error("WRONG_OTP");
                }
                if (data.phone !== '917984545163') {
                    this.updateOtp(id);
                }
                data = yield user_schema_1.User.findOneAndUpdate({ _id: new bson_1.ObjectID(id) }, { $set: { isVerified: true } }, { new: true });
                const tokenData = yield this.addNewToken(id);
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
    generateValidUsername(firstName, id = null) {
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
    addPhone(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user;
                if (body.authProvider === 'google') {
                    user = yield socialAuth_1.default.getGoogleUserInfo(body.access_token);
                }
                else if (body.authProvider === 'facebook') {
                    user = yield socialAuth_1.default.getFacebookUserInfo(body.access_token);
                }
                console.log('User At Addding Phone In Social Auth:', user);
                if (user) {
                    let temp = yield user_schema_1.User.findOne({ $or: [{ $and: [{ email: { $ne: null } }, { email: { $eq: user.email } }] }, { $and: [{ facebookId: { $ne: null } }, { facebookId: { $eq: user.id } }] }] }); //If User exist but starting facebook auth
                    let updatePhone = yield user_schema_1.User.findOne({ $or: [{ facebookId: user.id }, { appleSub: user.id }] }); // If user added facebookId but while adding phone number entred worng number and an OTP is sent
                    if (temp) {
                        // if (body.authProvider === 'facebook') {
                        //   await User.updateOne({ phone: body.phone }, { $set: { facebookId: user.id } });
                        // } 
                        // let otpData;
                        // if (body.phone === '9876543219') {
                        //   otpData = { proceed: true };
                        // } else {
                        //   const otp = this.updateOtp(temp._id);
                        //   console.log(otp);
                        //   otpData = await this.sendOtpToMobile(otp, body.phone);
                        //   console.log(otpData);
                        // }
                        // TODO: Uncomment
                        const token = this.addNewToken(temp._id);
                        if (temp) {
                            return { _id: temp._id, isExisted: true, token };
                        }
                        else {
                            throw new httpErrors_1.HTTP400Error("Unable to Send OTP");
                        }
                    }
                    else if (updatePhone) {
                        let data = yield user_schema_1.User.findOneAndUpdate({ $or: [{ facebookId: user.id }, { appleSub: user.id }] }, { $set: { phone: body.phone } });
                        if (data) {
                            const otp = this.updateOtp(data._id);
                            console.log(otp);
                            let otpData;
                            otpData = yield this.sendOtpToMobile(otp, body.phone);
                            console.log(otpData);
                            if (otpData.proceed) {
                                return { _id: data._id, isExisted: false };
                            }
                            else {
                                throw new httpErrors_1.HTTP400Error("Unable to Send OTP");
                            }
                        }
                        else {
                            throw new httpErrors_1.HTTP400Error('Error in Facebook User for Updatiing Phone');
                        }
                    }
                    else { // If we are adding a completely new user
                        let u;
                        let userName = yield this.generateValidUsername(user.given_name);
                        if (body.authProvider === 'facebook') {
                            u = {
                                role: 'user',
                                firstName: `${user.given_name}`,
                                username: userName,
                                lastName: `${user.family_name}`,
                                phone: body.phone,
                                facebookId: user.id
                            };
                        }
                        else if (body.authProvider === 'google') {
                            console.log(user);
                            u = {
                                role: 'user',
                                firstName: `${user.given_name}`,
                                username: userName,
                                lastName: `${user.family_name}`,
                                phone: body.phone,
                                email: user.email,
                            };
                        }
                        let data = yield this.add(u);
                        const otp = this.updateOtp(data._id);
                        console.log(otp);
                        let otpData;
                        otpData = yield this.sendOtpToMobile(otp, body.phone);
                        console.log(otpData);
                        if (otpData.proceed) {
                            return { _id: data._id, isExisted: false };
                        }
                        else {
                            throw new httpErrors_1.HTTP400Error("Unable to Send OTP");
                        }
                    }
                }
                else {
                    throw new httpErrors_1.HTTP400Error('Not Authorised to edit phone number');
                }
            }
            catch (e) {
                console.log(e);
                throw new httpErrors_1.HTTP400Error(e);
            }
        });
    }
    genrateOTP(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = helpers_1.otpGenerator();
            const res = yield this.sendOtpToMobile(otp, phone);
            if (res.proceed) {
                return { res, proceed: true };
            }
            return { proceed: false };
        });
    }
    ;
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
                let otpData;
                otpData = yield this.sendOtpToMobile(otp, phone);
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
    ;
}
exports.UserModel = UserModel;
exports.default = new UserModel();
//# sourceMappingURL=user.model.js.map