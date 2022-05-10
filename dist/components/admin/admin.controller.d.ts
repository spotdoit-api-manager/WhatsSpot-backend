import { NextFunction, Request, Response } from "express";
export declare class AdminController {
    addNewAdmin: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    loginWithPhone: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    verifyOtp: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    metrics: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: AdminController;
export default _default;
