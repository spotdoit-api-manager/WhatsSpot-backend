/* eslint-disable @typescript-eslint/interface-name-prefix */
import {NextFunction, Request, Response, Router} from "express";
import { ERoles } from "../../components/user/user.interface";
import {AdminAuthorization, Authorization, RoleAuthorization} from "../middleware/auth.middleware";

type Wrapper = ((router: Router) => void);

// load all middleware with this function call
export const applyMiddleware = (
  middlewareWrappers: Wrapper[],
  router: Router
) => {
  for (const wrapper of middlewareWrappers) {
    wrapper(router);
  }
};

/* Handles all type of api requests. */

type Handler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;


export interface IRoute {
  path: string | string[];
  method: string;
  role?: ERoles | string;
  escapeAuth?: boolean;
  adminOnly?: boolean;
  handler: Handler[];
}

// loading all routes and initialize to use them.
export const applyRoutes = (routes: IRoute[], router: Router) => {
  for (const route of routes) {
    const {method, path, escapeAuth, handler, adminOnly, role} = route;
    if (escapeAuth) {
      (router as any)[method](path, handler);
    } else if (role) {
      (router as any)[method](path, [Authorization(role), RoleAuthorization(role), ...handler]);
    } else if (adminOnly) {
      (router as any)[method](path, [Authorization(role), AdminAuthorization, ...handler]);
    } else {
      (router as any)[method](path, [Authorization(role), ...handler]);
    }
  }
  return router;
};

export const mongoDBProjectFields = (fieldsString: string, prefix?: string) => {
  const result: any = {};
  fieldsString.split(" ").map(field => {
    if (prefix) {
      result[prefix + "." + field] = 1;
    } else {
      result[field] = 1;
    }
  });
  return result;
};

export const getPaginationInfo = (pageNo: number=1)=>{
  const limit = 20;
  const skip = (pageNo-1)*limit;
  return {limit,skip};
};


export  const validateMobile=(phone: string="")=>{
   return true; 
};

export const sanatizeMobile=(phone: string)=>{
  return phone.replace("+","");
};

export const deSanatizeMobile=(phone: string)=>{
 
  return `+${sanatizeMobile(phone)}`;
};

export const validateEmail = (email: string = "")=> {
  if (!email.length) return false;
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const getSkipLimit = (pageNo: number=1)=>{
  const limit = 10;
  const skip = (pageNo-1)*limit;
  return {skip,limit};
};