import { NextFunction, Request, Response } from "express";
import ResponseHandler from "../../lib/helpers/responseHandler";
import adminModel from "./admin.model";

export class AdminController{
    public addNewAdmin = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          responseHandler.reqRes(req, res).onFetch("ADDED", await adminModel.addNewAdmin(req.body)).send();
        } catch (e) {
            console.log(e);
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };
    public loginWithPhone = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          responseHandler.reqRes(req, res).onFetch("OTP_SENT", await adminModel.loginWithPhone(req.body.phoneNumber)).send();
        } catch (e) {
          console.log(e);
          
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };

      public verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          const data = await adminModel.verifyOtp(req.params.id, req.body.otp);
          res.setHeader("Set-Cookie", data.cookie);
    
          // res.set('X-Auth', data.token);
          responseHandler
            .reqRes(req, res)
            .onFetch("otp has been verified", { user: data.adminData, tokenData: data.tokenData }, "otp verified now you can go forward.")
            .send();
        } catch (e) {
          next(responseHandler.sendError(e));
        }
      };
      public metrics = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          responseHandler.reqRes(req, res).onFetch("ADDED", await adminModel.metrics()).send();
        } catch (e) {
            console.log(e);
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };

      public fetchUsersBaseList = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          responseHandler.reqRes(req, res).onFetch("USERS_BASE_LIST_FETCHED", await adminModel.fetchUsersBaseList()).send();
        } catch (e) {
            console.log(e);
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };

      public userDetailedAccountMetrics = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          responseHandler.reqRes(req, res).onFetch("USER_DATA_FETCHED", await adminModel.userDetailedAccountMetrics(req.params.userId)).send();
        } catch (e) {
            console.log(e);
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };

      
      public getDeviceData = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          responseHandler.reqRes(req, res).onFetch("DEVICE_DATA_FETCHED", await adminModel.getDeviceData(req.params.deviceId)).send();
        } catch (e) {
            console.log(e);
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };
      public updateUserWalletBalance = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          responseHandler.reqRes(req, res).onFetch("WALLET_UPDATED", await adminModel.updateUserWalletBalance(req.params.walletId,req.body.balance)).send();
        } catch (e) {
            console.log(e);
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };

      public walletTransactions = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          responseHandler.reqRes(req, res).onFetch("TRANSACTIONS_FETCHED", await adminModel.walletTransactions(req.params.walletId)).send();
        } catch (e) {
            console.log(e);
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };
      public getLoggedUser = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          console.log("getting logged admin user",req.userId);
          
          const user = await adminModel.fetch(req.userId);
    
          responseHandler.reqRes(req, res).onFetch("Admin User Data", user).send();
        } catch (e) {
          responseHandler.sendError(e);
        }
      };
}



export default new AdminController();