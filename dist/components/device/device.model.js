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
exports.DeviceModel = void 0;
const httpErrors_1 = require("./../../lib/utils/httpErrors");
const device_shema_1 = require("./device.shema");
const whatsapp_client_service_1 = __importDefault(require("../../lib/services/whatsapp/whatsapp-client.service"));
const file_management_1 = __importDefault(require("../../lib/helpers/file.management"));
const baileys_md_1 = require("@adiwajshing/baileys-md");
const message_model_1 = __importDefault(require("../messages/message.model"));
class DeviceModel {
    newDevice(body) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(body);
            const device = yield this.findDeviceByPhone(body.phone);
            if (device)
                throw new httpErrors_1.HTTP400Error("DEVICE_ALREADY_PRESENT");
            const newDevice = new device_shema_1.Device(body);
            const data = yield newDevice.saveDevice();
            return data;
        });
    }
    getQr(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield this.findDeviceById(body.deviceId);
            if (!device)
                throw new httpErrors_1.HTTP400Error("DEVICE_NOT_FOUND");
            console.log("qr request for phone ", device.phone);
            if (device.authState)
                return { message: "ALREADY_AUTHENTICATED" };
            if (!device.authState && device.reason && device.reason.statusCode === baileys_md_1.DisconnectReason.loggedOut) {
                return { message: "DEVICE_LOGGED_OUT" };
            }
            const data = whatsapp_client_service_1.default.getClientQr(device.phone);
            return { message: "QR_REQUESTED" };
        });
    }
    ;
    addMessageToQueue(body, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("send text message request");
            const device = yield this.findDeviceById(deviceId);
            if (!device)
                throw new httpErrors_1.HTTP400Error("DEVICE_NOT_FOUND");
            const numbers = body.numbers.split(",");
            for (let i = 0; i < numbers.length; i++) {
                const to = numbers[i];
                const newBody = { phone: device.phone, to, message: body.message, status: "pending" };
                const result = yield message_model_1.default.addMessageToQueue(newBody);
            }
            return { message: "Message Added To Queue" };
        });
    }
    sendTextMessage(body, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield this.findDeviceById(deviceId);
            if (!device)
                throw new httpErrors_1.HTTP400Error("DEVICE_NOT_FOUND");
            const result = yield whatsapp_client_service_1.default.sendTextMessage(device.phone, body.to, body.message);
            console.log(result);
        });
    }
    deleteAuth(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield this.findDeviceById(body.deviceId);
            if (!device)
                throw new httpErrors_1.HTTP400Error("DEVICE_NOT_FOUND");
            console.log("delete auth request for phone ", device.phone);
            const authFilePath = `${device.phone}_cred.json`;
            file_management_1.default.deleteFile(authFilePath);
            yield this.updateDevice(device.phone, { reason: null });
            return { message: "AUTH_DELETED" };
        });
    }
    ;
    logoutDevice(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield this.findDeviceById(body.deviceId);
            if (!device)
                throw new httpErrors_1.HTTP400Error("DEVICE_NOT_FOUND");
            const data = yield whatsapp_client_service_1.default.logoutClient(device.phone);
            if (data.error)
                throw new httpErrors_1.HTTP400Error(data.message);
            return { message: "DEVICE_LOGGED_OUT" };
        });
    }
    updateDevice(phone, clientData) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("updaing client ", phone, clientData);
            if (!phone)
                return console.log("phone not provided in client update");
            const options = { upsert: true, new: true, setDefaultsOnInsert: true };
            const client = yield device_shema_1.Device.findOneAndUpdate({ phone: phone }, Object.assign({}, clientData), options);
            if (!client)
                return { error: true, message: "some error occured" };
            return { error: false };
        });
    }
    findDeviceByPhone(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield device_shema_1.Device.findOne({ phone });
            return device;
        });
    }
    findDeviceById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield device_shema_1.Device.findById(id);
            return device;
        });
    }
    findDeviceByCondition(condition) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield device_shema_1.Device.aggregate([{
                    $match: condition
                }]);
            return data;
        });
    }
}
exports.DeviceModel = DeviceModel;
exports.default = new DeviceModel();
//# sourceMappingURL=device.model.js.map