"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = __importDefault(require("./user.controller"));
exports.default = [
    {
        path: "/user",
        method: "get",
        handler: [user_controller_1.default.fetchAll]
    },
    {
        path: "/user",
        method: "post",
        handler: [user_controller_1.default.create]
    },
    {
        path: "/user/registerWithPhone",
        method: "post",
        escapeAuth: true,
        handler: [user_controller_1.default.registerWithPhone]
    },
    {
        path: "/user/loginWithPhone",
        method: "post",
        escapeAuth: true,
        handler: [user_controller_1.default.loginWithPhone]
    },
    {
        path: "/user/resendOTP/:id",
        method: "post",
        escapeAuth: true,
        handler: [user_controller_1.default.resendOTP]
    },
    {
        path: "/user/metrics",
        method: "get",
        handler: [user_controller_1.default.fetchAccountMetrics]
    },
    {
        path: "/user/loggedUser",
        method: "get",
        handler: [user_controller_1.default.getLoggedUser]
    },
    {
        path: "/login",
        method: "post",
        escapeAuth: true,
        handler: [user_controller_1.default.logIn]
    },
    {
        path: "/user/activePlan",
        method: "get",
        escapeAuth: false,
        handler: [user_controller_1.default.getActivePlan]
    },
    {
        path: "/user/:id/verifyOtp",
        method: "post",
        escapeAuth: true,
        handler: [user_controller_1.default.verifyOtp]
    },
    {
        path: "/user/settings/notifications",
        method: "post",
        escapeAuth: false,
        handler: [user_controller_1.default.updateNotificationSettings]
    },
    {
        path: "/user/settings/profile",
        method: "post",
        escapeAuth: false,
        handler: [user_controller_1.default.updateProfile]
    },
    {
        path: "/user/email/otp",
        method: "post",
        escapeAuth: false,
        handler: [user_controller_1.default.sendEmailVerification]
    },
    {
        path: "/user/email/verify",
        method: "post",
        escapeAuth: false,
        handler: [user_controller_1.default.verifyEmailOtp]
    },
];
//# sourceMappingURL=index.js.map