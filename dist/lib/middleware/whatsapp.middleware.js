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
const device_model_1 = __importDefault(require("../../components/device/device.model"));
const httpErrors_1 = require("../utils/httpErrors");
exports.DeviceKeyValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.query) {
            const token = req.query.key;
            const data = yield handleToken(token);
            if (data) {
                req.deviceId = data._id;
                next();
            }
        }
        else {
            throw new httpErrors_1.HTTP401Error("Invalid Key", "You may have not passed the api key in parameters");
        }
    }
    catch (e) {
        e = new httpErrors_1.HTTP401Error(e.message, "You may have not passed the authorization key in header");
        next(e);
    }
});
const handleToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (token) {
        const tokenData = yield jsonwebtoken_1.default.verify(token, index_1.deviceKeyConfig.jwtSecretKey);
        const data = yield device_model_1.default.findDeviceById(tokenData.deviceId);
        if (data && data._id) {
            return data;
        }
        else {
            throw new httpErrors_1.HTTP401Error("Invalid api key...");
        }
    }
    else {
        // tslint:disable-next-line: no-string-throw
        throw new httpErrors_1.HTTP401Error("Api key not provided");
    }
});
//# sourceMappingURL=whatsapp.middleware.js.map