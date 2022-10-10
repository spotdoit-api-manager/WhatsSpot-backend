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
exports.OTPMessagesService = void 0;
const index_1 = require("../../config/index");
const axios_1 = __importDefault(require("axios"));
const whatsapp_enum_1 = require("./whatsapp/whatsapp.enum");
const logger_1 = __importDefault(require("../utils/logger"));
const whatsapp_client_service_1 = __importDefault(require("./whatsapp/whatsapp-client.service"));
// import whatsappClientService from "./whatsapp/whatsapp-client.service";
// const plivo = require("plivo");
const logFileName = "[OTPService] : ";
class OTPMessagesService {
    constructor() {
        // private _plivoClient: any;
        // constructor() {
        //   this._plivoClient = new plivo.Client(pilvoConfig.authId,pilvoConfig.authToken);
        // }
        this.sendTextLocalMessage = (to, message) => __awaiter(this, void 0, void 0, function* () {
            return axios_1.default.get("https://api.textlocal.in/send/", {
                params: {
                    apiKey: "jkhljkhkljhkljhkljh7i87gho87y8y8",
                    // sender: 'SENDER',
                    numbers: "91" + to,
                    message: message
                }
            }).then((response) => {
                const responseJson = response.data;
                console.log(responseJson);
                if (responseJson.status === "success") {
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
        });
    }
    // async sendPilvoSMS(fullNumber: string, message: string) {
    //   const result = await this._plivoClient.messages.create(pilvoConfig.sourceNumber, fullNumber, message);
    //   console.log("pilvo result ",result);
    //   return {proceed: true};
    // }
    sendFast2Sms(number, message) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("sending message to ", number, message);
            const body = {
                route: "v3",
                sender_id: index_1.fast2SmsConfig.senderId,
                message: message,
                language: "english",
                flash: 0,
                numbers: number,
            };
            try {
                const result = yield axios_1.default.post(index_1.fast2SmsConfig.url, body, {
                    headers: { authorization: index_1.fast2SmsConfig.authToken, "content-type": "application/json" },
                });
                if (result.data && result.data.return) {
                    return { proceed: true };
                }
                return { proceed: false, message: result.data.message };
            }
            catch (err) {
                console.error("sendFast2Sms send error" + err);
                return { proceed: false };
            }
        });
    }
    sendWhatsappMessage(to, message) {
        try {
            whatsapp_client_service_1.default.sendTypeMessage(whatsapp_enum_1.EWhatsappMessageTypes.TEXT_MESSAGE, { text: message }, process.env.TEST_MESSAGE_DEVICE_NUMBER, to);
        }
        catch (e) {
            logger_1.default.info(logFileName, `Error sending whatsapp message to ${to}`);
        }
    }
}
exports.OTPMessagesService = OTPMessagesService;
exports.default = new OTPMessagesService();
//# sourceMappingURL=message.service.js.map