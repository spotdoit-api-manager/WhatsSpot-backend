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
exports.MessageModel = void 0;
const message_schema_1 = require("./message.schema");
class MessageModel {
    addMessageToQueue(messageBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const newMessage = new message_schema_1.MessageQueue(messageBody);
            let data = newMessage.addMessage();
            if (data) {
                return { error: false };
            }
            return { error: true, message: "NOT_ADDED" };
        });
    }
    addMultipleMessageToQueue(messages) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield message_schema_1.MessageQueue.insertMany(messages);
            if (result) {
                return { error: false };
            }
            return { error: true, message: "NOT_ADDED" };
        });
    }
    addFastMessage(messageBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const newMessage = new message_schema_1.FastMessage(messageBody);
            let data = yield newMessage.addMessage();
            if (data) {
                return { error: false };
            }
            return { error: true, message: "NOT_ADDED" };
        });
    }
}
exports.MessageModel = MessageModel;
exports.default = new MessageModel();
//# sourceMappingURL=message.model.js.map