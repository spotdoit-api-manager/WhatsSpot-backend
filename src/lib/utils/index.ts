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
    // const regmm='^([0|+[0-9]{1,5})?([7-9][0-9]{9})$';
    // const regmob = new RegExp(regmm);
    if(phone.length==12){
        return true;
    }
        return false;    
};

export const sanatizeMobile=(phone: string)=>{
  phone.replace("+","");
  if(phone.length==10) return `91${phone}`;
  return phone;
};

export const deSanatizeMobile=(phone: string)=>{
  phone.replace("+","");
  if(phone.length==12) return phone.slice(2);
  return phone;
};