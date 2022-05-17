import { NextFunction, Request, Response } from "express";
import ResponseHandler from "../../lib/helpers/responseHandler";
import stripePaymentModel  from "./stripe.model";

export class StripePaymentController{
    public createNewSession = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          responseHandler.reqRes(req, res).onFetch("SESSION_CREATED", await stripePaymentModel.createNewSession(req.userId,req.walletId,req.body.planId)).send();
        } catch (e) {
            console.log(e);
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      }

      public fetchSession = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          responseHandler.reqRes(req, res).onFetch("SESSION_FETCHED", await stripePaymentModel.fetchSession(req.userId,req.body.sessionId)).send();
        } catch (e) {
            console.log(e);
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      }

      public expireSession = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          responseHandler.reqRes(req, res).onFetch("SESSION_EXPIRED", await stripePaymentModel.expireSession(req.userId,req.body.sessionId)).send();
        } catch (e) {
            console.log(e);
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      }
}

export default new StripePaymentController();