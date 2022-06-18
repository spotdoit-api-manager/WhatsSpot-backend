"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
        path: "/wallet/rate",
        method: "get",
        escapeAuth: false,
        handler: [wallet_controller_1.default.getRate]
    },
];
//# sourceMappingURL=index.js.map