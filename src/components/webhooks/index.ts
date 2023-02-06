import webhooksController from "./webhooks.controller";

export default [
    {
        path: "/webhooks/logs",
        method: "get",
        handler: [webhooksController.fetchWebhooksMessage]
    }
];