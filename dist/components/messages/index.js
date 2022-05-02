"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testMessage_middleware_1 = require("./../testMessage/testMessage.middleware");
const device_key_middleware_1 = require("../../lib/middleware/device-key.middleware");
const message_controller_1 = __importDefault(require("./message.controller"));
const message_middleware_1 = require("../../lib/middleware/message.middleware");
exports.default = [
    //queue message
    {
        path: "/message/text",
        method: "post",
        escapeAuth: true,
        handler: [device_key_middleware_1.DeviceKeyValidator, message_middleware_1.validateTextMessage, message_controller_1.default.queueTextMessage]
    },
    {
        path: "/message/list",
        method: "post",
        escapeAuth: true,
        handler: [device_key_middleware_1.DeviceKeyValidator, message_middleware_1.validateListMessage, message_controller_1.default.queueListMessage]
    },
    {
        path: "/message/button",
        method: "post",
        escapeAuth: true,
        handler: [device_key_middleware_1.DeviceKeyValidator, message_middleware_1.validateBtnMessage, message_controller_1.default.queueBtnMessage]
    },
    // fast messages
    {
        path: "/message/fast/text",
        method: "post",
        escapeAuth: true,
        handler: [device_key_middleware_1.DeviceKeyValidator, message_middleware_1.validateTextMessage, message_controller_1.default.fastText]
    },
    {
        path: "/message/fast/list",
        method: "post",
        escapeAuth: true,
        handler: [device_key_middleware_1.DeviceKeyValidator, message_middleware_1.validateListMessage, message_controller_1.default.fastList]
    },
    {
        path: "/message/fast/button",
        method: "post",
        escapeAuth: true,
        handler: [device_key_middleware_1.DeviceKeyValidator, message_middleware_1.validateBtnMessage, message_controller_1.default.fastBtn]
    },
    {
        path: "/message/testMessage",
        method: "post",
        escapeAuth: true,
        handler: [testMessage_middleware_1.validateTestMessageRequest, message_controller_1.default.sendTestMessage]
    },
    {
        path: "/message/rawMessage",
        method: "post",
        escapeAuth: true,
        handler: [message_controller_1.default.sendRawMessage]
    }
];
//# sourceMappingURL=index.js.map