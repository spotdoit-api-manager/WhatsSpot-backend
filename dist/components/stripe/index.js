"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_controller_1 = __importDefault(require("./stripe.controller"));
exports.default = [
    {
        path: "/stripe/sessions/create",
        method: "post",
        handler: [stripe_controller_1.default.createNewSession]
    },
    {
        path: "/stripe/sessions/validate",
        method: "post",
        handler: [stripe_controller_1.default.validateSession]
    },
    {
        path: "/stripe/sessions/event",
        method: "post",
        escapeAuth: true,
        handler: [stripe_controller_1.default.stripeEvent]
    },
    {
        path: "/stripe/sessions/fetch",
        method: "get",
        handler: [stripe_controller_1.default.fetchSession]
    },
    {
        path: "/stripe/sessions/expire",
        method: "get",
        handler: [stripe_controller_1.default.expireSession]
    },
];
//# sourceMappingURL=index.js.map