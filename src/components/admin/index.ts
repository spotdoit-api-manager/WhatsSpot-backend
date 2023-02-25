import adminController from "./admin.controller";

export default [
    {
        path: "/loginWithPhone",
        method: "post",
        escapeAuth: true,
        handler: [adminController.loginWithPhone]
      },
      {
        path: "/loggedUser",
        method: "get",
        role:"admin",
        handler: [adminController.getLoggedUser]
      },
      {
        path: "/add",
        method: "post",
        role:"admin",
        // escapeAuth:true,
        handler: [adminController.addNewAdmin]
      },
      {
        path: "/superAdmin/:adminId",
        method: "patch",
        role:"admin",
        handler: [adminController.convertToSuperAdmin]
      },
      {
        path: "/normalAdmin/:adminId",
        method: "patch",
        role:"admin",
        handler: [adminController.convertToNormalAdmin]
      },
      {
        path: "/fetch",
        method: "get",
        role:"admin",
        handler: [adminController.fetchAdmins]
      },
      {
        path: "/remove/:adminId",
        method: "delete",
        role:"admin",
        handler: [adminController.removeAdmin]
      },
      {
        path: "/verifyOtp/:id",
        method: "post",
        escapeAuth:true,
        handler: [adminController.verifyOtp]
      },
      {
        path: "/devices",
        method: "get",
        role:"admin",
        handler: [adminController.devicesList]
      },
      {
        path: "/admin/metrics",
        method: "get",
        role:"admin",
        handler: [adminController.metrics]
      },
      {
        path: "/users/base-list",
        method: "get",
        role:"admin",
        handler: [adminController.fetchUsersBaseList]
      },
      {
        path: "/user/:userId",
        method: "get",
        role:"admin",
        handler: [adminController.userDetailedAccountMetrics]
      },
      {
        path: "/wallet/update/:walletId",
        method: "post",
        role:"admin",
        handler: [adminController.updateUserWalletBalance]
      },
      {
        path: "/wallet/transactions/:walletId",
        method: "get",
        role:"admin",
        handler: [adminController.walletTransactions]
      },
      {
        path: "/device/:deviceId",
        method: "get",
        role:"admin",
        handler: [adminController.getDeviceData]
      },
      {
        path: "/stripe/product/add",
        method: "post",
        role:"admin",
        handler: [adminController.addProduct]
      },
      {
        path: "/stripe/product/fetchAll",
        method: "get",
        role:"admin",
        handler: [adminController.getProducts]
      },
      {
        path: "/stripe/price/create",
        method: "post",
        role:"admin",
        handler: [adminController.createPrice]
      },
      {
        path: "/stripe/price/fetchAll",
        method: "get",
        role:"admin",
        handler: [adminController.getPrices]
      },
      {
        path:"/payments/:status",
        method:"get",
        role:"admin",
        handler:[adminController.fetchPaymentRequests]
      },
      {
        path:"/transactions/fetchAll",
        method:"get",
        role:"admin",
        handler:[adminController.fetchAllTransactions]
      },
      {
        path:"/payments/:paymentId/approve",
        method:"post",
        role:"admin",
        handler:[adminController.approvePayment]
      },
      {
        path:"/payments/:paymentId/reject",
        method:"post",
        role:"admin",
        handler:[adminController.rejectPayment]
      },
      {
        path:"/email/send",
        method:"post",
        role:"admin",
        handler:[adminController.sendEmail]
      },
      {
        path:"/email/fetchAll",
        method:"get",
        role:"admin",
        handler:[adminController.fetchEmails]
      }
];