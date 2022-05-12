"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_controller_1 = __importDefault(require("./admin.controller"));
exports.default = [
    {
        path: "/admin/loginWithPhone",
        method: "post",
        escapeAuth: true,
        handler: [admin_controller_1.default.loginWithPhone]
    },
    {
        path: "/admin/loggedUser",
        method: "get",
        role: "admin",
        handler: [admin_controller_1.default.getLoggedUser]
    },
    {
        path: "/admin/add",
        method: "post",
        role: "admin",
        handler: [admin_controller_1.default.addNewAdmin]
    },
    {
        path: "/admin/verifyOtp/:id",
        method: "post",
        escapeAuth: true,
        handler: [admin_controller_1.default.verifyOtp]
    },
    {
        path: "/admin/metrics",
        method: "get",
        role: "admin",
        handler: [admin_controller_1.default.metrics]
    },
    {
        path: "/admin/users/base-list",
        method: "get",
        role: "admin",
        handler: [admin_controller_1.default.fetchUsersBaseList]
    },
    {
        path: "/admin/user/:userId",
        method: "get",
        role: "admin",
        handler: [admin_controller_1.default.userDetailedAccountMetrics]
    },
    {
        path: "/admin/wallet/update/:walletId",
        method: "post",
        role: "admin",
        handler: [admin_controller_1.default.updateUserWalletBalance]
    },
];
//# sourceMappingURL=index.js.map