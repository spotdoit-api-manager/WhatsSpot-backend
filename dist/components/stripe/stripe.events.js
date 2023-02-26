"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_controller_1 = __importDefault(require("./stripe.controller"));
exports.default = [
    {
        path: "/stripe/event",
        method: "post",
        escapeAuth: true,
        handler: [stripe_controller_1.default.stripeEvent]
        // validateStripeEvent,
    },
];
//# sourceMappingURL=stripe.events.js.map