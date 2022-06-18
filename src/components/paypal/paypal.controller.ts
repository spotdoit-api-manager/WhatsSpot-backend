import { NextFunction, Request, Response } from "express";
import ResponseHandler from "../../lib/helpers/responseHandler";
import paypalModel from "./paypal.model";

export class PayPalController {
    public createOrder = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {    
          responseHandler.reqRes(req, res).onFetch("ORDER_CREATED", await paypalModel.createOrder(req.userId,req.walletId,req.body.planId,req.body.amount,req.body.currency)).send();
        } catch (e) {
          // send error with next function.
          console.log("error in creating order ",e);
          next(responseHandler.sendError(e));
        }
      };

      public verifyOrder = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {

          responseHandler.reqRes(req, res).onFetch("ORDER_VERIFIED", await paypalModel.verifyOrder(req.userId,req.walletId,req.body.orderId,req.body.transactionId)).send();
        } catch (e) {
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };
}

export default new PayPalController();