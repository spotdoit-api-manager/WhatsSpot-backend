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
exports.DeviceKeyValidator = void 0;
const index_1 = require("./../../config/index");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const httpErrors_1 = require("../utils/httpErrors");
const logger_1 = __importDefault(require("../../core/logger"));
const logFileName = "[WhatsappMiddleWare]";
const handleToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (token) {
        const tokenData = yield jsonwebtoken_1.default.verify(token, index_1.deviceKeyConfig.jwtSecretKey);
        // const data: any = await deviceModel.findDeviceById(tokenData.deviceId);
        return tokenData;
    }
    else {
        // tslint:disable-next-line: no-string-throw
        throw new httpErrors_1.HTTP401Error("Api key not provided");
    }
});
exports.DeviceKeyValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        logger_1.default.info(logFileName, `Header is ${req.headers.authorization}`);
        if ((_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            const tokenData = yield handleToken(token);
            if (tokenData) {
                req.deviceId = tokenData.deviceId;
                req.userId = tokenData.userId;
                req.walletId = tokenData.walletId;
                next();
            }
        }
        else {
            throw new httpErrors_1.HTTP401Error("INVALID_KEY", "You may have not passed the api key in parameters");
        }
    }
    catch (e) {
        e = new httpErrors_1.HTTP401Error(e.message, "You may have not passed the authorization key in header");
        next(e);
    }
});
//# sourceMappingURL=whatsapp.middleware.js.map