"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// provider.ts
const instance_manager_1 = __importDefault(require("instance-manager"));
const instanceProvider = new instance_manager_1.default();
// instanceProvider.addClass(Whatsapp);
exports.default = instanceProvider;
//# sourceMappingURL=instance.provider.js.map