"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const whatsapp_middleware_1 = require("./../../lib/middleware/whatsapp.middleware");
const message_controller_1 = __importDefault(require("./message.controller"));
exports.default = [
    {
        path: "/message/addToQueue",
        method: "post",
        escapeAuth: true,
        handler: [whatsapp_middleware_1.DeviceKeyValidator, message_controller_1.default.addToQueue]
    },
    {
        path: "/message/send/textMessage",
        method: "post",
        escapeAuth: true,
        handler: [whatsapp_middleware_1.DeviceKeyValidator, message_controller_1.default.sendTextMessage]
    }
];
//# sourceMappingURL=index.js.map