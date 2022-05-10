import { NextFunction, Request, Response } from "express";
export declare class RazorPayController {
    createNewOrder: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    verifyPayment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: RazorPayController;
export default _default;
