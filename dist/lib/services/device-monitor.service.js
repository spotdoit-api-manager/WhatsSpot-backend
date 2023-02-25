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
exports.DeviceMonitor = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const device_schema_1 = require("./../../components/device/device.schema");
const whatsapp_client_service_1 = __importDefault(require("./whatsapp/whatsapp-client.service"));
const logger_1 = __importDefault(require("../utils/logger"));
const notify_service_1 = __importDefault(require("./notify.service"));
class DeviceMonitor {
    constructor() {
        this.MAX_LAST_USED = 15;
    }
    init() {
        logger_1.default.info("Device Monitor Started");
        const intervalTime = 24 * 60 * 60 * 1000;
        const interval = setInterval(() => {
            logger_1.default.info("Device Monitor Running.....");
            this.unAuthorizeDevices();
        }, intervalTime);
    }
    getUnUsedDevices() {
        return __awaiter(this, void 0, void 0, function* () {
            // get 15 days older date
            const date = (0, dayjs_1.default)().subtract(this.MAX_LAST_USED, "days");
            const devices = yield device_schema_1.Device.find({
                $and: [
                    {
                        lastUsed: {
                            $lt: date.toDate(),
                        },
                    },
                    {
                        authState: true,
                    },
                ],
            });
            return devices;
        });
    }
    unAuthorizeDevices() {
        return __awaiter(this, void 0, void 0, function* () {
            const devices = yield this.getUnUsedDevices();
            logger_1.default.info(`Found ${devices.length} devices to unAuthorize`);
            devices.forEach((device) => __awaiter(this, void 0, void 0, function* () {
                logger_1.default.info(`Device ${device.name} is not used for ${this.MAX_LAST_USED} days, unAuthorizing it`);
                yield whatsapp_client_service_1.default.logoutClient(device.phone);
                device.authState = false;
                device.reason = {
                    statusCode: 401,
                    message: "Device is not used for 15 days",
                    error: "Device is not used for 15 days",
                };
                device.lastUsed = new Date();
                yield notify_service_1.default.deviceUnAuthorizedDueToNotUsed(device._id);
                yield device.save();
            }));
            logger_1.default.info("Device Monitor Finished");
        });
    }
}
exports.DeviceMonitor = DeviceMonitor;
exports.default = new DeviceMonitor();
//# sourceMappingURL=device-monitor.service.js.map