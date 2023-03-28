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
exports.ConfigModel = void 0;
const httpErrors_1 = require("./../../lib/utils/httpErrors");
const whatsapp_enum_1 = require("./../../lib/services/whatsapp/whatsapp.enum");
const configs_schema_1 = __importDefault(require("./configs.schema"));
class ConfigModel {
    constructor() {
        this.getConfigs = (adminId) => __awaiter(this, void 0, void 0, function* () {
            return configs_schema_1.default.findOne();
        });
        this.updateConfigs = (adminId, configs) => __awaiter(this, void 0, void 0, function* () {
            if (Object.values(whatsapp_enum_1.EWhatsappMessageTypes).indexOf(configs.testMessageType) === -1)
                throw new httpErrors_1.HTTP400Error("Invalid Test Message Type");
            return configs_schema_1.default.findOneAndUpdate({}, configs, { new: true });
        });
        this.createDefaultConfig = () => __awaiter(this, void 0, void 0, function* () {
            if (yield configs_schema_1.default.findOne())
                return;
            const config = new configs_schema_1.default();
            return config.save();
        });
        this.createDefaultConfig();
    }
}
exports.ConfigModel = ConfigModel;
exports.default = new ConfigModel();
//# sourceMappingURL=configs.model.js.map