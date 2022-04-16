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
    // // {
    // //   path: "/logout",
    // //   method: "post",
    // //   escapeAuth: true,
    // //   handler: [userController.logIn]
    // // },
    // {
    //   path: "/signup",
    //   method: "post",
    //   escapeAuth:true,
    //   handler:[userController.signUp]
    // },
    // {
    //   path: "/follower/:id",
    //   method: "post",
    //   handler:[userController.addFollower]
    // },
    // {
    //   path: "/following/:id",
    //   method: "post",
    //   handler:[userController.addFollowing]
    // },
    // {
    //   path: "/followrequest/:id",
    //   method: "post",
    //   handler:[userController.addFolowRequest]
    // },
    // {
    //   path: "/auth",
    //   method: "post",
    //   escapeAuth:true,
    //   handler:[userController.loginViaSocialAccessToken]
    // },
    // {
    //   path: "/user/:id",
    //   method: "get",
    //   handler: [userController.fetch]
    // },
    // {
    //   path: "/user/:id",
    //   method: "patch",
    //   handler: [userController.update]
    // },
    // // {
    // //   path: "/user/verifyUser",
    // //   escapeAuth: true,
    // //   method: "post",
    // //   handler:[userController.verifyUser]
    // // },
    // {
    //   path: "/user/addPhoneNumber",
    //   method: "post",
    //   handler:[userController.addPhoneNumber]
    // },
    {
        path: "/user/:id/verifyOtp",
        method: "get",
        escapeAuth: true,
        handler: [user_controller_1.default.verifyOtp]
    },
];
//# sourceMappingURL=index.js.map