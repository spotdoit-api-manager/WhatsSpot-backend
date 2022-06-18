"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const device_key_middleware_1 = require("../../lib/middleware/device-key.middleware");
const contact_controller_1 = __importDefault(require("../contact/contact.controller"));
const wallet_controller_1 = __importDefault(require("../wallet/wallet.controller"));
exports.default = [
    {
        path: "/wallet/balance",
        method: "get",
        escapeAuth: true,
        handler: [device_key_middleware_1.DeviceKeyValidator, wallet_controller_1.default.fetchBalance]
    },
    {
        path: "/contacts",
        method: "get",
        escapeAuth: true,
        handler: [device_key_middleware_1.DeviceKeyValidator, contact_controller_1.default.fetchContacts]
    },
    {
        path: "/contacts/groups",
        method: "get",
        escapeAuth: true,
        handler: [device_key_middleware_1.DeviceKeyValidator, contact_controller_1.default.fetchGroups]
    },
    {
        path: "/contact/group/contacts/:groupId",
        method: "get",
        escapeAuth: true,
        handler: [device_key_middleware_1.DeviceKeyValidator, contact_controller_1.default.fetchGroupContacts]
    },
];
//# sourceMappingURL=index.js.map