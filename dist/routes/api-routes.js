"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = __importDefault(require("../components/api"));
const messages_1 = __importDefault(require("../components/messages"));
exports.default = [
    ...messages_1.default,
    ...api_1.default
];
//# sourceMappingURL=api-routes.js.map