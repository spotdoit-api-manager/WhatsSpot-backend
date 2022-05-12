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
exports.AdminController = void 0;
const responseHandler_1 = __importDefault(require("../../lib/helpers/responseHandler"));
const admin_model_1 = __importDefault(require("./admin.model"));
class AdminController {
    constructor() {
        this.addNewAdmin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                responseHandler.reqRes(req, res).onFetch("ADDED", yield admin_model_1.default.addNewAdmin(req.body)).send();
            }
            catch (e) {
                console.log(e);
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.loginWithPhone = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                responseHandler.reqRes(req, res).onFetch("OTP_SENT", yield admin_model_1.default.loginWithPhone(req.body.phoneNumber)).send();
            }
            catch (e) {
                console.log(e);
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.verifyOtp = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                const data = yield admin_model_1.default.verifyOtp(req.params.id, req.body.otp);
                res.setHeader("Set-Cookie", data.cookie);
                // res.set('X-Auth', data.token);
                responseHandler
                    .reqRes(req, res)
                    .onFetch("otp has been verified", { user: data.adminData, tokenData: data.tokenData }, "otp verified now you can go forward.")
                    .send();
            }
            catch (e) {
                next(responseHandler.sendError(e));
            }
        });
        this.metrics = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                responseHandler.reqRes(req, res).onFetch("ADDED", yield admin_model_1.default.metrics()).send();
            }
            catch (e) {
                console.log(e);
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.fetchUsersBaseList = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                responseHandler.reqRes(req, res).onFetch("USERS_BASE_LIST_FETCHED", yield admin_model_1.default.fetchUsersBaseList()).send();
            }
            catch (e) {
                console.log(e);
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.userDetailedAccountMetrics = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                responseHandler.reqRes(req, res).onFetch("USER_DATA_FETCHED", yield admin_model_1.default.userDetailedAccountMetrics(req.params.userId)).send();
            }
            catch (e) {
                console.log(e);
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.updateUserWalletBalance = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                responseHandler.reqRes(req, res).onFetch("WALLET_UPDATED", yield admin_model_1.default.updateUserWalletBalance(req.params.walletId, req.body.balance)).send();
            }
            catch (e) {
                console.log(e);
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.getLoggedUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("getting logged admin user", req.userId);
                const user = yield admin_model_1.default.fetch(req.userId);
                responseHandler.reqRes(req, res).onFetch("Admin User Data", user).send();
            }
            catch (e) {
                responseHandler.sendError(e);
            }
        });
    }
}
exports.AdminController = AdminController;
exports.default = new AdminController();
//# sourceMappingURL=admin.controller.js.map