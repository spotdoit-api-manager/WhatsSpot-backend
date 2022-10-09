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
exports.DeviceUtils = void 0;
const bson_1 = require("bson");
const device_schema_1 = require("./device.schema");
class DeviceUtils {
    findDeviceById(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield device_schema_1.Device.findOne({ userId: new bson_1.ObjectID(userId), _id: new bson_1.ObjectID(deviceId), "isDeleted.status": false });
            return device;
        });
    }
    findDeviceByCondition(condition) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield device_schema_1.Device.aggregate([{
                    $match: condition
                }]);
            return data;
        });
    }
    updateDevice(deviceId, clientData) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = { upsert: true, new: true, setDefaultsOnInsert: true };
            const client = yield device_schema_1.Device.findByIdAndUpdate(deviceId, Object.assign({}, clientData), options);
            if (!client)
                return { error: true, message: "some error occurred" };
            return { error: false };
        });
    }
}
exports.DeviceUtils = DeviceUtils;
exports.default = new DeviceUtils();
//# sourceMappingURL=device.utils.js.map