import { NextFunction, Request, Response } from "express";
export declare class MessageController {
    queueTextMessage: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    queueListMessage: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    queueBtnMessage: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    queueTemplateMessage: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    addToQueue: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    fastText: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    fastList: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    fastBtn: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    fastTemplate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    sendTextMessage: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    fastImageBtn: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    sendTestMessage: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    sendRawMessage: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: MessageController;
export default _default;
