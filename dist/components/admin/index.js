"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_controller_1 = __importDefault(require("./admin.controller"));
exports.default = [
    {
        path: "/loginWithPhone",
        method: "post",
        escapeAuth: true,
        handler: [admin_controller_1.default.loginWithPhone]
    },
    {
        path: "/loggedUser",
        method: "get",
        role: "admin",
        handler: [admin_controller_1.default.getLoggedUser]
    },
    {
        path: "/add",
        method: "post",
        role: "admin",
        // escapeAuth:true,
        handler: [admin_controller_1.default.addNewAdmin]
    },
    {
        path: "/superAdmin/:adminId",
        method: "patch",
        role: "admin",
        handler: [admin_controller_1.default.convertToSuperAdmin]
    },
    {
        path: "/normalAdmin/:adminId",
        method: "patch",
        role: "admin",
        handler: [admin_controller_1.default.convertToNormalAdmin]
    },
    {
        path: "/fetch",
        method: "get",
        role: "admin",
        handler: [admin_controller_1.default.fetchAdmins]
    },
    {
        path: "/remove/:adminId",
        method: "delete",
        role: "admin",
        handler: [admin_controller_1.default.removeAdmin]
    },
    {
        path: "/verifyOtp/:id",
        method: "post",
        escapeAuth: true,
        handler: [admin_controller_1.default.verifyOtp]
    },
    {
        path: "/devices",
        method: "get",
        role: "admin",
        handler: [admin_controller_1.default.devicesList]
    },
    {
        path: "/admin/metrics",
        method: "get",
        role: "admin",
        handler: [admin_controller_1.default.metrics]
    },
    {
        path: "/users/base-list",
        method: "get",
        role: "admin",
        handler: [admin_controller_1.default.fetchUsersBaseList]
    },
    {
        path: "/user/:userId",
        method: "get",
        role: "admin",
        handler: [admin_controller_1.default.userDetailedAccountMetrics]
    },
    {
        path: "/wallet/update/:walletId",
        method: "post",
        role: "admin",
        handler: [admin_controller_1.default.updateUserWalletBalance]
    },
    {
        path: "/wallet/transactions/:walletId",
        method: "get",
        role: "admin",
        handler: [admin_controller_1.default.walletTransactions]
    },
    {
        path: "/device/:deviceId",
        method: "get",
        role: "admin",
        handler: [admin_controller_1.default.getDeviceData]
    },
    {
        path: "/stripe/product/add",
        method: "post",
        role: "admin",
        handler: [admin_controller_1.default.addProduct]
    },
    {
        path: "/stripe/product/fetchAll",
        method: "get",
        role: "admin",
        handler: [admin_controller_1.default.getProducts]
    },
    {
        path: "/stripe/price/create",
        method: "post",
        role: "admin",
        handler: [admin_controller_1.default.createPrice]
    },
    {
        path: "/stripe/price/fetchAll",
        method: "get",
        role: "admin",
        handler: [admin_controller_1.default.getPrices]
    },
    {
        path: "/payments/:status",
        method: "get",
        role: "admin",
        handler: [admin_controller_1.default.fetchPaymentRequests]
    },
    {
        path: "/payments/:paymentId/approve",
        method: "post",
        role: "admin",
        handler: [admin_controller_1.default.approvePayment]
    }
];
//# sourceMappingURL=index.js.map