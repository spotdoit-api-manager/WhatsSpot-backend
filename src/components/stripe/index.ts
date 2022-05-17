import stripeController from "./stripe.controller";

export default [
    {
        path: "/stripe/sessions/create",
        method: "post",
        handler: [stripeController.createNewSession]
    },
    {
        path: "/stripe/sessions/fetch",
        method: "get",
        handler: [stripeController.fetchSession]
    },
    {
        path: "/stripe/sessions/expire",
        method: "get",
        handler: [stripeController.expireSession]
    },

];