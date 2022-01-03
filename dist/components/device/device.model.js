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
const whatsapp_service_1 = __importDefault(require("./../../lib/services/whatsapp.service"));
const device_shema_1 = require("./device.shema");
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
            const device = yield this.findDeviceByPhone(body.phone);
            if (!device)
                throw new httpErrors_1.HTTP400Error("DEVICE_NOT_AVAILABLE");
            const data = yield whatsapp_service_1.default.getQr(body.phone);
            return { message: "QR_REQUESTED" };
        });
    }
    ;
    findDeviceByPhone(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield device_shema_1.Device.findOne({ phone });
            return device;
        });
    }
}
exports.DeviceModel = DeviceModel;
exports.default = new DeviceModel();
//# sourceMappingURL=device.model.js.map