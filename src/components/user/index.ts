import userController from "./user.controller";

export default [
  {
    path: "/user",
    method: "get",
    handler: [userController.fetchAll]
  },
  {
    path: "/user",
    method: "post",
    handler: [userController.create]
  },
  {
    path:"/user/registerWithPhone",
    method:"post",
    escapeAuth:true,
    handler:[userController.registerWithPhone]
  },
  {
    path:"/user/loginWithPhone",
    method:"post",
    escapeAuth:true,
    handler:[userController.loginWithPhone]
  },
  {
    path:"/user/resendOTP/:id",
    method:"post",
    escapeAuth:true,
    handler:[userController.resendOTP]
  },
  {
    path: "/user/metrics",
    method: "get",
    handler: [userController.fetchAccountMetrics]
},

  {
    path: "/user/loggedUser",
    method: "get",
    handler:[userController.getLoggedUser]
  },
  {
    path: "/login",
    method: "post",
    escapeAuth:true,
    handler:[userController.logIn]
  },
  {
    path:"/user/activePlan",
    method:"get",
    escapeAuth:false,
    handler: [userController.getActivePlan]
},
 
  {
    path: "/user/:id/verifyOtp",
    method: "post",
    escapeAuth: true,
    handler: [userController.verifyOtp]
  },
  {
    path: "/user/settings/notifications",
    method: "post",
    escapeAuth: false,
    handler: [userController.updateNotificationSettings]
  },
  {
    path: "/user/settings/profile",
    method: "post",
    escapeAuth: false,
    handler: [userController.updateProfile]
  },
  {
    path: "/user/email/otp",
    method: "post",
    escapeAuth: false,
    handler: [userController.sendEmailVerification]
  },
  {
    path: "/user/email/verify",
    method: "post",
    escapeAuth: false,
    handler: [userController.verifyEmaliOtp]
  },
  
];

