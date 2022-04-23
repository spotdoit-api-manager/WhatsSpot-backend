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
exports.TestMessageModel = void 0;
const httpErrors_1 = require("../../lib/utils/httpErrors");
const config_1 = require("../../config");
const whatsapp_client_service_1 = __importDefault(require("../../lib/services/whatsapp/whatsapp-client.service"));
const testMessage_schema_1 = require("./testMessage.schema");
class TestMessageModel {
    fetchTestMessageByPhoneNumber(phoneNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield testMessage_schema_1.TestMessage.findOne({ phoneNumber: phoneNumber }).lean();
        });
    }
    sendTestMessage(body, testMessageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield whatsapp_client_service_1.default.sendTextMessage(config_1.testMessageConfig.devicePhone, body.to, config_1.testMessageConfig.message);
            if (result.error)
                throw new httpErrors_1.HTTP401Error(result.message);
            yield this.updateOrCreateTestMessage(body.to, testMessageId);
        });
    }
    sendRawMessage(to, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield whatsapp_client_service_1.default.sendRawMessage(config_1.testMessageConfig.devicePhone, to, message);
            if (result.error)
                throw new httpErrors_1.HTTP401Error(result.message);
        });
    }
    updateOrCreateTestMessage(phoneNumber, testMessageId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (testMessageId) {
                return yield testMessage_schema_1.TestMessage.findByIdAndUpdate(testMessageId, { $inc: { messageCount: 1 } });
            }
            const newTestMessageBody = { phoneNumber, messageCount: 0 };
            const newTestMessage = new testMessage_schema_1.TestMessage(newTestMessageBody);
            const result = yield newTestMessage.addTestMessage();
            return result;
        });
    }
}
exports.TestMessageModel = TestMessageModel;
exports.default = new TestMessageModel();
//# sourceMappingURL=testMessage.model.js.map