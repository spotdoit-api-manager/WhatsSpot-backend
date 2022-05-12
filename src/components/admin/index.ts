import adminController from "./admin.controller";

export default [
    {
        path: "/admin/loginWithPhone",
        method: "post",
        escapeAuth: true,
        handler: [adminController.loginWithPhone]
      },
      {
        path: "/admin/loggedUser",
        method: "get",
        role:"admin",
        handler: [adminController.getLoggedUser]
      },
      {
        path: "/admin/add",
        method: "post",
        role:"admin",
        handler: [adminController.addNewAdmin]
      },
      {
        path: "/admin/verifyOtp/:id",
        method: "post",
        escapeAuth:true,
        handler: [adminController.verifyOtp]
      },
      {
        path: "/admin/metrics",
        method: "get",
        role:"admin",
        handler: [adminController.metrics]
      },
      {
        path: "/admin/users/base-list",
        method: "get",
        role:"admin",
        handler: [adminController.fetchUsersBaseList]
      },
      {
        path: "/admin/user/:userId",
        method: "get",
        role:"admin",
        handler: [adminController.userDetailedAccountMetrics]
      },
      {
        path: "/admin/wallet/update/:walletId",
        method: "post",
        role:"admin",
        handler: [adminController.updateUserWalletBalance]
      },
      {
        path: "/admin/wallet/transactions/:walletId",
        method: "get",
        role:"admin",
        handler: [adminController.walletTransactions]
      },
      {
        path: "/admin/device/:deviceId",
        method: "get",
        role:"admin",
        handler: [adminController.getDeviceData]
      },
];