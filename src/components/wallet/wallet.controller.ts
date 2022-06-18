import { NextFunction, Request, Response } from "express";
import { getRate } from "../../lib/services/exchange-rate.service";
import ResponseHandler from "../../lib/helpers/responseHandler";
import walletModel from "./wallet.model";

export class WalletController{
    public fetchBalance = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        console.log("fetch wallet balance");
        
        try {
         const result =  await walletModel.fetchWalletBalance(req.userId,req.walletId);
          responseHandler.reqRes(req, res).onCreate("BALANCE_FETCHED",result).send();
        } catch (e) {
          next(responseHandler.sendError(e));
        }
      }

      public fetchTransactions = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();        
        try {
         const result =  await walletModel.fetchTransactions(req.userId,req.walletId,req.query.page);
          responseHandler.reqRes(req, res).onCreate("TRANSACTION_FETCHED",result).send();
        } catch (e) {
          next(responseHandler.sendError(e));
        }
      }
      public getRate = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();        
        try {
         const result =  await getRate();
          responseHandler.reqRes(req, res).onCreate("TRANSACTION_FETCHED",result).send();
        } catch (e) {
          next(responseHandler.sendError(e));
        }
      }
}

export default new WalletController();