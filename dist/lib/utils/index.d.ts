import { NextFunction, Request, Response, Router } from "express";
import { ERoles } from "../../components/user/user.interface";
type Wrapper = ((router: Router) => void);
export declare const applyMiddleware: (middlewareWrappers: Wrapper[], router: Router) => void;
type Handler = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;
export interface IRoute {
    path: string | string[];
    method: string;
    role?: ERoles | string;
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
export declare const validateEmail: (email?: string) => false | RegExpMatchArray;
export declare const getSkipLimit: (pageNo?: number) => {
    skip: number;
    limit: number;
};
export {};
