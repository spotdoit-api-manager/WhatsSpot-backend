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
exports.RoleAuthorization = exports.AdminAuthorization = exports.Authorization = void 0;
const httpErrors_1 = require("../utils/httpErrors");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = require("mongoose");
const config_1 = require("../../config");
exports.Authorization = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.header("Authorization")) {
            const token = req.header('Authorization') || "";
            const data = yield handleToken(token);
            if (data) {
                console.log(data);
                req.userId = data._id;
                req.walletId = data.walletId;
                req.role = data.role;
                req.token = token.split(" ")[1];
                next();
            }
        }
        else if (req.header("escapeAuth")) {
            next();
        }
        else {
            throw new httpErrors_1.HTTP401Error("You are not authorized", "You may have not passed the authorization key in header");
        }
    }
    catch (e) {
        e = new httpErrors_1.HTTP401Error(e.message, "You may have not passed the authorization key in header");
        next(e);
    }
});
exports.AdminAuthorization = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.role === 'admin') {
            next();
        }
        else {
            const e = new httpErrors_1.HTTP401Error("Incorrect Role for Request. Your Role : " + req.role);
            next(e);
        }
    }
    catch (e) {
        e = new httpErrors_1.HTTP401Error(e.message);
        next(e);
    }
});
exports.RoleAuthorization = (role) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.role === 'admin' || req.role === role) {
            next();
        }
        else {
            throw new httpErrors_1.HTTP401Error("Incorrect Role for Request. Your Role : " + req.role);
        }
    }
    catch (e) {
        e = new httpErrors_1.HTTP401Error(e.message);
        next(e);
    }
});
const handleToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (token) {
        token = token.split(" ")[1];
        const userData = (yield jsonwebtoken_1.default.verify(token, config_1.commonConfig.jwtSecretKey)) || { user: {} };
        const userDetails = userData;
        const data = yield mongoose_1.model('User').findOne({
            _id: userDetails.id,
        });
        if (data) {
            return data;
        }
        else {
            // tslint:disable-next-line: no-string-throw
            throw "You are not authorized user.........";
        }
    }
    else {
        // tslint:disable-next-line: no-string-throw
        throw "You are not authorized user";
    }
});
//# sourceMappingURL=auth.middleware.js.map