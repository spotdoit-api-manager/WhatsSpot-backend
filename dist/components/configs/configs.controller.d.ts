import { NextFunction, Request, Response } from "express";
export declare class ContactController {
    getConfigs: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateConfigs: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: ContactController;
export default _default;
