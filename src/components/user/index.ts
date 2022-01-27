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
    path: "/user/metrics",
    method: "get",
    handler: [userController.fetchAccountMetrics]
},

  {
    path: "/user/loggeduser",
    method: "get",
    handler:[userController.getLoggedUser]
  },
  {
    path: "/login",
    method: "post",
    escapeAuth:true,
    handler:[userController.logIn]
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
    handler: [userController.verifyOtp]
  },
  // {
  //   path: "/user/generateOTP",
  //   escapeAuth:true,
  //   method: "post",
  //   handler:[userController.generateOTP]
  // },
  // {
  //   path: "/user/login/socialAuth/addphone",
  //   method: "get",
  //   escapeAuth: true,
  //   handler: [userController.socialAuthAddPhone]
  // },
//   {
//     path: "/user/:id/photos",
//     method: "get",
//     handler: [userController.photos]
//   }, {
//     path: "/user/:id/liked",
//     method: "get",
//     handler: [userController.likes]
//   }, {
//     path: "/user/:id/follower",
//     method: "get",
//     handler: [userController.followers]
//   },
//   {
//     path: "/user/:id/following",
//     method: "get",
//     handler: [userController.followings]
//   },
//   {
//     path: "/user/is-available/userName",
//     method: "get",
//     escapeAuth: true,
//     handler: [userController.isUsernameExist]
//   },
//   {
//     path: "/user/search/on",
//     method: "get",
//     handler: [userController.searchByName]
//   }
];

