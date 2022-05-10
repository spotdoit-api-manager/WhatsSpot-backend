import { NextFunction, Request, Response } from "express";
export declare const notFoundError: () => never;
export declare const clientError: (err: Error, req: Request, res: Response, next: NextFunction) => void;
export declare const serverError: (err: Error, req: Request, res: Response, next: NextFunction) => void;
