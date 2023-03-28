"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../components/user"));
const device_1 = __importDefault(require("../components/device"));
const wallet_1 = __importDefault(require("../components/wallet"));
const razorpay_1 = __importDefault(require("../components/razorpay"));
const plans_1 = __importDefault(require("../components/plans"));
const contact_1 = __importDefault(require("../components/contact"));
const admin_1 = __importDefault(require("../components/admin"));
const stripe_1 = __importDefault(require("../components/stripe"));
const paypal_1 = __importDefault(require("../components/paypal"));
const qrpay_1 = __importDefault(require("../components/qrpay"));
const webhooks_1 = __importDefault(require("../components/webhooks"));
const configs_1 = __importDefault(require("../components/configs"));
exports.default = [
    ...user_1.default,
    ...contact_1.default,
    ...device_1.default,
    // ...Messages,
    ...wallet_1.default,
    ...razorpay_1.default,
    ...plans_1.default,
    ...admin_1.default,
    ...stripe_1.default,
    ...paypal_1.default,
    ...qrpay_1.default,
    ...webhooks_1.default,
    ...configs_1.default
];
//# sourceMappingURL=index.js.map