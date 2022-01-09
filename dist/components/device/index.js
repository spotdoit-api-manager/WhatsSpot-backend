"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const s3_1 = require("../../lib/services/s3");
const device_controller_1 = __importDefault(require("./device.controller"));
exports.default = [
    {
        path: "/device/newDevice",
        method: "post",
        escapeAuth: true,
        handler: [device_controller_1.default.newDevice]
    },
    {
        path: "/device/getQr/:deviceId",
        method: "get",
        escapeAuth: true,
        handler: [device_controller_1.default.getQr]
    },
    {
        path: "/device/auth/delete/:deviceId",
        method: "delete",
        escapeAuth: true,
        handler: [device_controller_1.default.deleteAuth]
    },
    {
        path: "/device/auth/logout/:deviceId",
        method: "get",
        escapeAuth: true,
        handler: [device_controller_1.default.logoutDevice]
    },
    {
        path: "/device/message/addMessageToQueue/:deviceId",
        method: "post",
        escapeAuth: true,
        handler: [device_controller_1.default.addMessageToQueue]
    },
    {
        path: "/device/send/textMessage/:deviceId",
        method: "post",
        escapeAuth: true,
        handler: [device_controller_1.default.sendTextMessage]
    },
    {
        path: "/device/send/imageMessage/:deviceId",
        method: "post",
        escapeAuth: true,
        handler: [s3_1.s3UploadMulter.single('file'), device_controller_1.default.sendImageMessage]
    }
];
//# sourceMappingURL=index.js.map