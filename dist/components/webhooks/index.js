"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webhooks_controller_1 = __importDefault(require("./webhooks.controller"));
exports.default = [
    {
        path: "/webhooks/logs",
        method: "get",
        handler: [webhooks_controller_1.default.fetchWebhooksMessage]
    }
];
//# sourceMappingURL=index.js.map