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
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpMiddleWare = void 0;
const redis = require("async-redis");
const client = redis.createClient();
const maxOtpRequest = 3;
const perNMin = 5;
exports.otpMiddleWare = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone } = req.body; // could be ip as well, ip = req.ip;
    const keyName = phone;
    const current = yield client.get(phone);
    if (current && current > maxOtpRequest) {
        throw new Error("Too many requests, please try after sometime!");
    }
    else {
        yield client.multi()
            .incr(keyName)
            .expire(keyName, perNMin * 60) // number of seconds
            .exec();
        next();
    }
});
//# sourceMappingURL=otp.middleware.js.map