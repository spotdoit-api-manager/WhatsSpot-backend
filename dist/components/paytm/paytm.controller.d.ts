import { NextFunction, Request, Response } from "express";
declare class PaytmController {
    initiateTransaction: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    responsePaytm: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: PaytmController;
export default _default;
