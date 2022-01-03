"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const device_controller_1 = __importDefault(require("./device.controller"));
exports.default = [
    {
        path: "/device/newDevice",
        method: "post",
        escapeAuth: true,
        handler: [device_controller_1.default.newDevice]
    },
    {
        path: "/device/getQr/:phone",
        method: "get",
        escapeAuth: true,
        handler: [device_controller_1.default.getQr]
    }
];
//# sourceMappingURL=index.js.map