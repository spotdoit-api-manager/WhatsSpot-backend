import PaytmController from "./paytm.controller";

export default [
    {
        path: "/paytm",
        method: "post",
        handler: [PaytmController.initiateTransaction]
    },
    {
        path: "/paytm/response",
        method: "post",
        escapeAuth:true,
        handler: [PaytmController.responsePaytm]
    },
];