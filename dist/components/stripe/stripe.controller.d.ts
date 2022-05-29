import { NextFunction, Request, Response } from "express";
export declare class StripePaymentController {
    createNewSession: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    stripeEvent: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    validateSession: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    fetchSession: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    expireSession: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: StripePaymentController;
export default _default;
