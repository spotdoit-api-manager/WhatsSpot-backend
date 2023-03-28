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
const whatsapp_enum_1 = require("./../../lib/services/whatsapp/whatsapp.enum");
const httpErrors_1 = require("../../lib/utils/httpErrors");
const config_1 = require("../../config");
const whatsapp_client_service_1 = __importDefault(require("../../lib/services/whatsapp/whatsapp-client.service"));
const testMessage_schema_1 = require("./testMessage.schema");
const configs_schema_1 = __importDefault(require("../configs/configs.schema"));
class TestMessageModel {
    fetchTestMessageByPhoneNumber(phoneNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield testMessage_schema_1.TestMessage.findOne({
                phoneNumber: phoneNumber,
            }).lean());
        });
    }
    sendTestMessage(body, testMessageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield configs_schema_1.default.findOne({}).select("testMessageType").lean();
            console.log("config is ", config.testMessageType);
            const message = this.getMessageBody(config.testMessageType || whatsapp_enum_1.EWhatsappMessageTypes.TEXT_MESSAGE);
            const result = yield whatsapp_client_service_1.default.sendTypeMessage(config.testMessageType, message, config_1.testMessageConfig.devicePhone, body.to);
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
                return yield testMessage_schema_1.TestMessage.findByIdAndUpdate(testMessageId, {
                    $inc: { messageCount: 1 },
                });
            }
            const newTestMessageBody = { phoneNumber, messageCount: 0 };
            const newTestMessage = new testMessage_schema_1.TestMessage(newTestMessageBody);
            const result = yield newTestMessage.addTestMessage();
            return result;
        });
    }
    getMessageBody(messageType) {
        switch (messageType) {
            case whatsapp_enum_1.EWhatsappMessageTypes.BUTTON_MESSAGE:
                return this.getButtonMessage();
                break;
            case whatsapp_enum_1.EWhatsappMessageTypes.TEMPLATE_MESSAGE:
                return this.getTemplateMessage();
                break;
            case whatsapp_enum_1.EWhatsappMessageTypes.LIST_MESSAGE:
                return this.getListMessage();
                break;
            case whatsapp_enum_1.EWhatsappMessageTypes.TEXT_MESSAGE:
                return this.getTextMessage();
        }
    }
    getTemplateMessage() {
        const buttons = [
            {
                index: 1,
                urlButton: {
                    displayText: "WhatsSpot Docs",
                    url: "https://docs.whatsspot.in",
                },
            },
            {
                index: 2,
                callButton: {
                    displayText: "Call WhatsSpot",
                    phoneNumber: "+919099858434",
                },
            },
        ];
        const templateMessage = {
            text: "Welcome to WhatsSpot!!\nThis is a test message.",
            footer: "nice footer, link: https://whatsspot.in",
            templateButtons: buttons,
        };
        return templateMessage;
    }
    getButtonMessage() {
        const buttons = [
            {
                buttonId: "button1",
                buttonText: {
                    displayText: "Button 1",
                },
                type: 1,
            },
            {
                buttonId: "button2",
                buttonText: {
                    displayText: "Button 2",
                },
                type: 1,
            },
        ];
        const buttonMessage = {
            text: "Welcome to WhatsSpot!!\nThis is a test message.",
            footer: "nice footer, link: https://whatsspot.in",
            buttons: buttons,
            headerType: 1,
        };
        return buttonMessage;
    }
    getTextMessage() {
        const textMessage = {
            text: "Welcome to WhatsSpot!!\nThis is a test message.",
        };
        return textMessage;
    }
    getListMessage() {
        const sections = [
            {
                title: "Section 1",
                rows: [
                    {
                        title: "Its awesome",
                        rowId: "option1",
                        description: "This is awesome feature",
                    },
                    {
                        title: "Love It",
                        rowId: "option2",
                        description: "This is a description",
                    },
                ],
            },
            {
                title: "Section 2",
                rows: [
                    { title: "Useful", rowId: "option3" },
                    { title: "Good", rowId: "option4" },
                ],
            },
        ];
        const listMessage = {
            text: "This is a test message",
            footer: "nice footer, link: https://whatsspot.in",
            title: "Welcome to WhatsSpot!!",
            buttonText: "View Option",
            sections,
        };
        return listMessage;
    }
}
exports.TestMessageModel = TestMessageModel;
exports.default = new TestMessageModel();
//# sourceMappingURL=testMessage.model.js.map