import { NextFunction, Request, Response } from "express";
import ResponseHandler from "../../lib/helpers/responseHandler";
import qrPayModel from "./qr-pay.model";

export class QrPayController{
    public createNewOrder = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {    
          responseHandler.reqRes(req, res).onFetch("ORDER_CREATED", await qrPayModel.createOrder(req.userId,req.walletId,req.body.transactionId,req.body.planId,req.body.amount)).send();
        } catch (e) {
          console.log(e);
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };
}


export default new QrPayController();