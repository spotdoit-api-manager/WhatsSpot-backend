import { NextFunction, Request, Response } from "express";
export declare class MessageController {
    addToQueue: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    sendFastMessage: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    sendTextMessage: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    sendTestMessage: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: MessageController;
export default _default;
