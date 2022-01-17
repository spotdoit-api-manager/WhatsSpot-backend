"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../../config");
exports.sendMessage = (to, body) => {
    const env = process.env.NODE_ENV;
    if (env == 'development')
        return { proceed: true };
    console.log(to, body, config_1.textLocalConfig.apiKey, 'hi');
    return axios_1.default.get('https://api.textlocal.in/send/', {
        params: {
            apiKey: "jkhljkhkljhkljhkljh7i87gho87y8y8",
            // sender: 'SENDER',
            numbers: '91' + to,
            message: body
        }
    }).then((response) => {
        const responseJson = response.data;
        console.log(responseJson);
        if (responseJson.status === 'success') {
            console.log(`Send OTP Success to ${to}`);
            return { proceed: true };
        }
        else {
            console.log("Error Sending OTP");
            console.log(responseJson);
            return { proceed: false };
        }
    }).catch(e => {
        console.log("Error Sending OTP");
        console.log(e);
        return { proceed: false };
    });
};
//# sourceMappingURL=textlocal.js.map