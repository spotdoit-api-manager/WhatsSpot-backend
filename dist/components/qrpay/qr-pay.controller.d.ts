import { NextFunction, Request, Response } from "express";
export declare class QrPayController {
    createNewOrder: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: QrPayController;
export default _default;
