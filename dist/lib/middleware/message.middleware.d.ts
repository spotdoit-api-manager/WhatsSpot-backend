import { NextFunction, Request, Response } from "express";
export declare const validateTextMessage: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateListMessage: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateBtnMessage: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateTemplateMessage: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateImageBtnMessage: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateImageTemplateMessage: (req: Request, res: Response, next: NextFunction) => void;
