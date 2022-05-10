import { NextFunction, Request, Response, Router } from "express";
declare type Wrapper = ((router: Router) => void);
export declare const applyMiddleware: (middlewareWrappers: Wrapper[], router: Router) => void;
declare type Handler = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;
export interface IRoute {
    path: string | string[];
    method: string;
    role?: string;
    escapeAuth?: boolean;
    adminOnly?: boolean;
    handler: Handler[];
}
export declare const applyRoutes: (routes: IRoute[], router: Router) => Router;
export declare const mongoDBProjectFields: (fieldsString: string, prefix?: string) => any;
export declare const getPaginationInfo: (pageNo?: number) => {
    limit: number;
    skip: number;
};
export declare const validateMobile: (phone?: string) => boolean;
export declare const sanatizeMobile: (phone: string) => string;
export declare const deSanatizeMobile: (phone: string) => string;
export {};
