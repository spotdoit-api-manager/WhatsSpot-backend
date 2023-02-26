import stripeController from "./stripe.controller";

export default [
    {
        path: "/stripe/event",
        method: "post",
        escapeAuth:true,
        handler: [stripeController.stripeEvent]
        // validateStripeEvent,
    },
];