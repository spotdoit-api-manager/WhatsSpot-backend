import { NextFunction, Request, Response } from "express";
export declare const validateStripeEvent: (req: Request, res: Response, next: NextFunction) => Promise<void>;
