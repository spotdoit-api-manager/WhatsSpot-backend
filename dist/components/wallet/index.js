"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const device_key_middleware_1 = require("./../../lib/middleware/device-key.middleware");
const wallet_controller_1 = __importDefault(require("./wallet.controller"));
exports.default = [
    {
        path: "/wallet/fetchBalance",
        method: "get",
        escapeAuth: false,
        handler: [wallet_controller_1.default.fetchBalance]
    },
    {
        path: "/wallet/fetchTransactions",
        method: "get",
        escapeAuth: false,
        handler: [wallet_controller_1.default.fetchTransactions]
    },
    {
        path: "/wallet/balance",
        method: "get",
        escapeAuth: true,
        handler: [device_key_middleware_1.DeviceKeyValidator, wallet_controller_1.default.fetchBalance]
    },
];
//# sourceMappingURL=index.js.map