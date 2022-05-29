import { NextFunction, Request, Response } from "express";
export declare class PayPalController {
    createOrder: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    verifyOrder: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: PayPalController;
export default _default;
