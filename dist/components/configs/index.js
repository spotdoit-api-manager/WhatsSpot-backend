"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configs_controller_1 = __importDefault(require("./configs.controller"));
exports.default = [
    {
        path: "/configs",
        method: "post",
        handler: [configs_controller_1.default.getConfigs],
        role: "admin"
    },
    {
        path: "/configs/update",
        method: "post",
        handler: [configs_controller_1.default.updateConfigs],
        role: "admin"
    }
];
//# sourceMappingURL=index.js.map