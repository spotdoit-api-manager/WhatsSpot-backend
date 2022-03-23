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
const user_model_1 = __importDefault(require("./user.model"));
const responseHandler_1 = __importDefault(require("../../lib/helpers/responseHandler"));
const customMessage_1 = require("../../lib/helpers/customMessage");
const httpErrors_1 = require("../../lib/utils/httpErrors");
class UserController {
    constructor() {
        this.fetchAll = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                responseHandler.reqRes(req, res).onFetch(customMessage_1.user.FETCH_ALL, yield user_model_1.default.fetchAll()).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.registerWithPhone = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                responseHandler.reqRes(req, res).onFetch('OTP_SENT', yield user_model_1.default.registerWithPhone(req.body)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.loginWithPhone = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                responseHandler.reqRes(req, res).onFetch('OTP_SENT', yield user_model_1.default.loginWithPhone(req.body)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.resendOTP = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                responseHandler.reqRes(req, res).onFetch('OTP_SENT_AGAIN', yield user_model_1.default.resendOTP(req.params.id, req.body)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                // const data =  await userModel.add(req.body);
                console.log(req.body);
                // res.set("X-Auth")
                responseHandler
                    .reqRes(req, res)
                    .onCreate(customMessage_1.user.CREATED, yield user_model_1.default.add(req.body), customMessage_1.user.CREATED_DEC)
                    .send();
            }
            catch (e) {
                console.log(e);
                next(responseHandler.sendError(e));
            }
        });
        this.fetch = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                responseHandler.reqRes(req, res).onCreate(customMessage_1.user.CREATED, yield user_model_1.default.fetch(req.params.id), customMessage_1.user.CREATED_DEC).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                responseHandler.reqRes(req, res).onCreate(customMessage_1.user.UPDATED, yield user_model_1.default.update(req.params.id, req.body)).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                yield user_model_1.default.delete(req.params.id);
                responseHandler.reqRes(req, res).onCreate(customMessage_1.user.UPDATED).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.fetchAccountMetrics = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                const result = yield user_model_1.default.getAccountMetrics(req.userId);
                responseHandler.reqRes(req, res).onCreate(customMessage_1.user.UPDATED, result).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        //   public adminLogin = async (req: Request, res: Response, next: NextFunction) => {
        //     try {
        //       responseHandler
        //         .reqRes(req, res)
        //         .onFetch("The otp has been sent to your phone. Please verify", await userModel.login(req.body.phone, true))
        //         .send();
        //     } catch (e) {
        //       next(responseHandler.sendError(e));
        //     }
        //   };
        //   public searchUsers = async (req: Request, res: Response, next: NextFunction) => {
        //     try {
        //       responseHandler.reqRes(req, res).onFetch(`Here are users`, await userModel.searchUsers(req.query)).send();
        //     } catch (e) {
        //       next(responseHandler.sendError(e));
        //     }
        //   };
        this.loginViaSocialAccessToken = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                const data = yield user_model_1.default.loginViaSocialAccessToken(req.query);
                // if user never existed then make user and save it to database
                responseHandler.reqRes(req, res).onCreate("Sign up Complete", data).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.socialAuthAddPhone = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                responseHandler.reqRes(req, res).onFetch("Phone Number added", yield user_model_1.default.addPhone(req.query)).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.verifyOtp = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                const data = yield user_model_1.default.verifyOtp(req.params.id, req.query.otp);
                res.setHeader('Set-Cookie', data.cookie);
                // res.set('X-Auth', data.token);
                responseHandler
                    .reqRes(req, res)
                    .onFetch("otp has been verified", { user: data.data, tokenData: data.tokenData }, "otp verified now you can go forward.")
                    .send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.getLoggedUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("getting logged user");
                const user = yield user_model_1.default.fetch(req.userId);
                responseHandler.reqRes(req, res).onFetch("User Data", user).send();
            }
            catch (e) {
                responseHandler.sendError(e);
            }
        });
        this.getActivePlan = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("getting user active plan");
                const activePlan = yield user_model_1.default.fetchUserActivePlan(req.userId);
                responseHandler.reqRes(req, res).onFetch("ACTIVE_PLAN", activePlan).send();
            }
            catch (e) {
                console.log(e);
                responseHandler.sendError(e);
            }
        });
        this.addFollower = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                const data = yield user_model_1.default.addFollower(req.params.id, req.body.user.id);
                responseHandler.reqRes(req, res).onCreate(customMessage_1.user.UPDATED, data).send();
            }
            catch (e) {
                responseHandler.sendError(e);
            }
        });
        this.addFollowing = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                req.body.userId = req.userId;
                console.log(req.userId);
                const data = yield user_model_1.default.addFollowing(req.params.id, req.body.userId);
                responseHandler.reqRes(req, res).onCreate(customMessage_1.user.UPDATED, data).send();
            }
            catch (e) {
                responseHandler.sendError(e);
            }
        });
        this.signUp = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                const data = yield user_model_1.default.signUp(req.body);
                responseHandler.reqRes(req, res).onCreate("Phone Number Added", data).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        // private createSendToken = async (req: Request, res: Response, next: NextFunction, user: any) => {
        //   const responseHandler = new ResponseHandler();
        //   let ikcbalance = await userModel.fetchWalletBalance(user._id);
        //   const token = this.signToken(user._id);
        //   // console.log(ikcbalance);
        //   // user.ikcbalance = ikcbalance;
        //   console.log(user);
        //   const data = {
        //     token,
        //     user,
        //     ikcbalance
        //   };
        //   responseHandler.reqRes(req, res).onCreate(msg.CREATED, data).send();
        // };
        // private signToken = (id: string) => {
        //   return jwt.sign({ id }, commonConfig.jwtSecretKey, {
        //     expiresIn: process.env.JWT_EXPIRES_IN,
        //   });
        // };
        this.logIn = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                const user = yield user_model_1.default.login(req.body);
                responseHandler.reqRes(req, res).onCreate("Login Successfully", user).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.addFolowRequest = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                if (req.userId) {
                    const data = yield user_model_1.default.addFollowRequest(req.params.id, req.userId);
                    responseHandler.reqRes(req, res).onCreate(customMessage_1.user.UPDATED, data).send();
                }
            }
            catch (e) {
                responseHandler.sendError(e);
            }
        });
        this.acceptFollowRequest = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                if (req.userId) {
                    const data = yield user_model_1.default.acceptFollowRequest(req.params.id, req.userId);
                    responseHandler.reqRes(req, res).onCreate(customMessage_1.user.UPDATED, data).send();
                }
            }
            catch (e) {
                responseHandler.sendError(e);
            }
        });
        this.isVerified = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                const data = yield user_model_1.default.isUserVerified(req.userId);
                if (!data.proceed) {
                    throw new httpErrors_1.HTTP400Error("NOTVERIFIED");
                }
                next();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.generateOTP = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                const otp = yield user_model_1.default.genrateOTP(req.body.phone);
                responseHandler.reqRes(req, res).onCreate("OTP sent", otp).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.addPhoneNumber = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                const data = yield user_model_1.default.addPhoneNumber(req.userId, req.query.phone);
                responseHandler.reqRes(req, res).onCreate("OTP Updated", data).send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.verifyUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                if (req.body.otp) {
                    const result = yield user_model_1.default.verifyUser(req.body.otp.otp.toString(), req.userId);
                    if (result.proceed) {
                        responseHandler.reqRes(req, res).onCreate("User Verified", res).send();
                    }
                    else {
                        throw Error("User Not Verified");
                    }
                }
                else {
                    throw new Error("OTP not found");
                }
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
    }
}
exports.default = new UserController();
//# sourceMappingURL=user.controller.js.map