import { validateStripeEvent } from "./strip.middleware";
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
        path: "/stripe/event",
        method: "post",
        escapeAuth:true,
        handler: [stripeController.stripeEvent]
        // validateStripeEvent,
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