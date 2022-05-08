import { NextFunction, Request, Response } from "express";
import ResponseHandler from "../../lib/helpers/responseHandler";
import razorPayModel from "./razorpay.model";


export class RazorPayController{
    public createNewOrder = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        console.log("create new order");
        
        try {    
          responseHandler.reqRes(req, res).onFetch("ORDER_CREATED", await razorPayModel.createOrder(req.userId,req.walletId,req.body.planId,req.body.amount)).send();
        } catch (e) {
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };

      public verifyPayment = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        console.log("create new order");
        
        try {    
          responseHandler.reqRes(req, res).onFetch("ORDER_CREATED", await razorPayModel.verifyPayment(req.userId,req.walletId,req.body)).send();
        } catch (e) {
          // send error with next function.
          next(responseHandler.sendError(e.message));
        }
      };
}

export default new RazorPayController();