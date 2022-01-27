import { NextFunction, Request, Response } from "express";
export declare class WalletController {
    fetchBalance: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: WalletController;
export default _default;
