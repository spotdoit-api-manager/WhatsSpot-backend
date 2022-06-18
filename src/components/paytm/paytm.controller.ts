import { NextFunction, Request, response, Response } from "express";
import ResponseHandler from "../../lib/helpers/responseHandler";
import Paytm from "./paytm.model";

class PaytmController {
    public initiateTransaction = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            responseHandler
                .reqRes(req, res)
                .onWrite(await Paytm.initiatePaytmTransaction(req.userId,req.walletId,req.body.planId,req.body.amount))
                .end();
        } catch (e) {
            // send error with next function.
            next(responseHandler.sendError(e));
        }
    };

    public responsePaytm = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
            responseHandler
                .reqRes(req, res)
                .onWrite(await Paytm.responseFromPaytm(req.body))
                .end();
        } catch (e) {
            // send error with next function.
            next(responseHandler.sendError(e));
        }
    };
}

export default new PaytmController();