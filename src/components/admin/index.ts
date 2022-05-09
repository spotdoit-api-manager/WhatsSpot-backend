import adminController from "./admin.controller";

export default [
    {
        path: "/admin/loginWithPhone",
        method: "post",
        escapeAuth: true,
        handler: [adminController.loginWithPhone]
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
];