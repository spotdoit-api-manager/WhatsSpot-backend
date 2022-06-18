import { Request, Response, NextFunction as Next } from "express";
export declare const requestLogger: (req: Request, res: Response, next: Next) => void;
