"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../components/user"));
const device_1 = __importDefault(require("../components/device"));
const wallet_1 = __importDefault(require("../components/wallet"));
const razorpay_1 = __importDefault(require("../components/razorpay"));
const messages_1 = __importDefault(require("../components/messages"));
const plans_1 = __importDefault(require("../components/plans"));
const contact_1 = __importDefault(require("../components/contact"));
const admin_1 = __importDefault(require("../components/admin"));
exports.default = [
    ...user_1.default,
    ...contact_1.default,
    ...device_1.default,
    ...messages_1.default,
    ...wallet_1.default,
    ...razorpay_1.default,
    ...plans_1.default,
    ...admin_1.default
];
//# sourceMappingURL=index.js.map