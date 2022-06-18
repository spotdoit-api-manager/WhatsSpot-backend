import { NextFunction, Request, Response } from "express";
import { ERoles } from "../../components/user/user.interface";
export declare const Authorization: (role: ERoles | string) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const AdminAuthorization: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const RoleAuthorization: (role: string) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
