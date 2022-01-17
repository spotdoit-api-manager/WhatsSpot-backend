"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../components/user"));
const device_1 = __importDefault(require("../components/device"));
exports.default = [
    ...user_1.default,
    ...device_1.default
];
//# sourceMappingURL=index.js.map