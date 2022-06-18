"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const paytm_controller_1 = __importDefault(require("./paytm.controller"));
exports.default = [
    {
        path: "/paytm",
        method: "post",
        handler: [paytm_controller_1.default.initiateTransaction]
    },
    {
        path: "/paytm/response",
        method: "post",
        escapeAuth: true,
        handler: [paytm_controller_1.default.responsePaytm]
    },
];
//# sourceMappingURL=index.js.map