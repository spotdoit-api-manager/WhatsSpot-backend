"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.SpotSchedular = void 0;
const plans_interface_1 = require("./../../components/plans/plans.interface");
const scheduler = __importStar(require("node-schedule"));
const device_interface_1 = require("../../components/device/device.interface");
const device_schema_1 = require("../../components/device/device.schema");
const logger_1 = __importDefault(require("../../core/logger"));
const bson_1 = require("bson");
const plans_schema_1 = require("../../components/plans/plans.schema");
const plans_model_1 = __importDefault(require("../../components/plans/plans.model"));
const logFileName = "[SpotSchedular]";
class SpotSchedular {
    reScheduleAllUserPlanExpiration() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(logFileName, "Rescheduling all user plan expiration");
            const userPlans = yield plans_schema_1.UserPlan.aggregate([
                { $match: {
                        planStatus: plans_interface_1.EPlanStatus.ACTIVE
                    } }
            ]);
            for (const plan of userPlans) {
                try {
                    yield this.scheduleUserPlanExpiration(plan);
                }
                catch (e) {
                    logger_1.default.error(logFileName, `Error in  user plan expire scheduling of user ${plan._id}`);
                }
            }
        });
    }
    scheduleUserPlanExpiration(plan) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(logFileName, `Scheduling user plan expiration  ${plan._id} at ${plan.endDate}`);
            const now = new Date();
            const expiresOn = plan.endDate;
            if (expiresOn < now) {
                return plans_model_1.default.expirePlan(plan);
            }
            const job = scheduler.scheduleJob(plan.endDate, () => __awaiter(this, void 0, void 0, function* () {
                yield plans_model_1.default.expirePlan(plan);
            }));
        });
    }
    reScheduleAllApiExpiration() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(logFileName, "Rescheduling all api key expiration");
            const apiKeys = yield device_schema_1.Device.aggregate([
                { $match: {} },
                { $project: {
                        apiKeys: 1,
                    } }
            ]);
            for (const deviceApi of apiKeys) {
                for (const api of deviceApi.apiKeys) {
                    try {
                        if (api.status == device_interface_1.EApiKeyStatus.ACTIVE) {
                            yield this.scheduleApiExpiration(deviceApi._id, api);
                        }
                    }
                    catch (e) {
                        logger_1.default.error(logFileName, `Error in  api expire scheduling of device ${deviceApi._id} for api ${api._id}`);
                    }
                }
            }
        });
    }
    scheduleApiExpiration(deviceId, apiKeyData) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            if (apiKeyData.expiresOn < now) {
                return yield this.expireApiKey(deviceId, apiKeyData);
            }
            logger_1.default.info(logFileName, `Scheduling api key expiration ${apiKeyData._id} at ${apiKeyData.expiresOn}`);
            const job = scheduler.scheduleJob(apiKeyData.expiresOn, () => __awaiter(this, void 0, void 0, function* () {
                yield this.expireApiKey(deviceId, apiKeyData);
            }));
        });
    }
    expireApiKey(deviceId, apiKey) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(logFileName, `Expiring api key ${apiKey._id}`);
            yield device_schema_1.Device.findOneAndUpdate({
                _id: new bson_1.ObjectID(deviceId),
                "apiKeys._id": new bson_1.ObjectID(apiKey._id),
            }, { $set: { "apiKeys.$.status.status": device_interface_1.EApiKeyStatus.EXPIRED } }, {
                new: true
            }).lean();
        });
    }
}
exports.SpotSchedular = SpotSchedular;
exports.default = new SpotSchedular();
//# sourceMappingURL=schedular.js.map