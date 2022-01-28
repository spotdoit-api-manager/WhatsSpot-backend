"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../components/user"));
const device_1 = __importDefault(require("../components/device"));
const walllet_1 = __importDefault(require("../components/walllet"));
const razorpay_1 = __importDefault(require("../components/razorpay"));
const messages_1 = __importDefault(require("../components/messages"));
exports.default = [
    ...user_1.default,
    ...device_1.default,
    ...messages_1.default,
    ...walllet_1.default,
    ...razorpay_1.default
];
//# sourceMappingURL=index.js.map