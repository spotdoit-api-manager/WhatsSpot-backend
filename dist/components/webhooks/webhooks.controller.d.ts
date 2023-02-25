import { NextFunction, Request, Response } from "express";
export declare class WebhookController {
    fetchWebhooksMessage: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: WebhookController;
export default _default;
