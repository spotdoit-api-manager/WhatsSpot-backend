import { NextFunction, Request, Response } from "express";
export declare const Authorization: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const AdminAuthorization: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const RoleAuthorization: (role: string) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
