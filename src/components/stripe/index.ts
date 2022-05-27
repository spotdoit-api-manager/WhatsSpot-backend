import stripeController from "./stripe.controller";

export default [
    {
        path: "/stripe/sessions/create",
        method: "post",
        handler: [stripeController.createNewSession]
    },
    {
        path: "/stripe/sessions/validate",
        method: "post",
        handler: [stripeController.validateSession]
    },
    {
        path: "/stripe/sessions/event",
        method: "post",
        escapeAuth:true,
        handler: [stripeController.stripeEvent]
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