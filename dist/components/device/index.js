"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const s3_1 = require("../../lib/services/s3");
const device_controller_1 = __importDefault(require("./device.controller"));
exports.default = [
    {
        path: "/device/newDevice/:code/add",
        method: "post",
        handler: [device_controller_1.default.newDevice]
    },
    {
        path: "/device/newDevice/code",
        method: "post",
        handler: [device_controller_1.default.newDeviceCode]
    },
    {
        path: "/device/:deviceId/fetch",
        method: "get",
        handler: [device_controller_1.default.fetchDevice]
    }, {
        path: "/device/fetchAll",
        method: "get",
        handler: [device_controller_1.default.fetchAllDevices]
    },
    {
        path: "/device/:deviceId/metrics",
        method: "get",
        handler: [device_controller_1.default.fetchDeviceMetrics]
    },
    {
        path: "/device/getQr/:deviceId",
        method: "get",
        escapeAuth: false,
        handler: [device_controller_1.default.getQr]
    },
    {
        path: "/device/removeClient/:deviceId",
        method: "get",
        escapeAuth: false,
        handler: [device_controller_1.default.removeClient]
    },
    {
        path: "/device/auth/delete/:deviceId",
        method: "delete",
        escapeAuth: false,
        handler: [device_controller_1.default.deleteAuth]
    },
    {
        path: "/device/auth/logout/:deviceId",
        method: "get",
        escapeAuth: false,
        handler: [device_controller_1.default.logoutDevice]
    },
    {
        path: "/device/:deviceId/keys/generate",
        method: "post",
        escapeAuth: false,
        handler: [device_controller_1.default.generateNewKey]
    },
    {
        path: "/device/:deviceId/keys",
        method: "get",
        escapeAuth: false,
        handler: [device_controller_1.default.getKeys]
    },
    {
        path: "/device/:deviceId/keys/delete/:keyId",
        method: "delete",
        escapeAuth: false,
        handler: [device_controller_1.default.deleteKey]
    },
    {
        path: "/device/:deviceId/message/addMessageToQueue",
        method: "post",
        escapeAuth: false,
        handler: [device_controller_1.default.addMessageToQueue]
    },
    {
        path: "/device/:deviceId/retryFailed",
        method: "post",
        escapeAuth: false,
        handler: [device_controller_1.default.retryFailedMessage]
    },
    {
        path: "/device/:deviceId/send/textMessage",
        method: "post",
        escapeAuth: false,
        handler: [device_controller_1.default.sendTextMessage]
    },
    {
        path: "/device/send/imageMessage/:deviceId",
        method: "post",
        escapeAuth: true,
        handler: [s3_1.s3UploadMulter.single("file"), device_controller_1.default.sendImageMessage]
    },
    {
        path: "/device/:deviceId/prevMessages",
        method: "get",
        escapeAuth: false,
        handler: [device_controller_1.default.fetchPrevMessages]
    },
    {
        path: "/device/removeDevice/:deviceId",
        method: "delete",
        handler: [device_controller_1.default.removeDevice]
    },
    {
        path: "/device/:deviceId/status",
        method: "get",
        handler: [device_controller_1.default.getDeviceStatus]
    },
];
//# sourceMappingURL=index.js.map