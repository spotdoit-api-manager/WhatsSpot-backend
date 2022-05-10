"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const device_key_middleware_1 = require("../../lib/middleware/device-key.middleware");
const contact_controller_1 = __importDefault(require("./contact.controller"));
exports.default = [
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
    {
        path: "/contact/add",
        method: "post",
        handler: [contact_controller_1.default.addNewContact]
    },
    {
        path: "/contact/fetch",
        method: "get",
        handler: [contact_controller_1.default.fetchContacts]
    },
    {
        path: "/contact/edit",
        method: "post",
        handler: [contact_controller_1.default.editContacts]
    },
    {
        path: "/contact/delete",
        method: "post",
        handler: [contact_controller_1.default.deleteContacts]
    },
    {
        path: "/contact/group/create",
        method: "post",
        handler: [contact_controller_1.default.createNewGroup]
    },
    {
        path: "/contact/group/fetch",
        method: "get",
        handler: [contact_controller_1.default.fetchGroups]
    },
    {
        path: "/contact/group/:groupId/contacts/fetch",
        method: "get",
        handler: [contact_controller_1.default.fetchGroupContacts]
    },
    {
        path: "/contact/group/:groupId/contacts/add",
        method: "post",
        handler: [contact_controller_1.default.addContactsToGroup]
    },
    {
        path: "/contact/group/:groupId/contacts/edit",
        method: "post",
        handler: [contact_controller_1.default.editGroupContacts]
    },
    {
        path: "/contact/group/:groupId/contacts/delete",
        method: "post",
        handler: [contact_controller_1.default.deleteGroupContacts]
    },
    {
        path: "/contact/group/:groupId/delete",
        method: "delete",
        handler: [contact_controller_1.default.deleteGroup]
    },
    {
        path: "/contact/group/:groupId/add",
        method: "post",
        handler: [contact_controller_1.default.addGroupContacts]
    }
];
//# sourceMappingURL=index.js.map