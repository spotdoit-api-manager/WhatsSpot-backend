import { EPayWith } from "./../../core/enums/pay-with.enum";
import { ETransactionTypes } from "./../transaction/transaction.interface";
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ETransactionStatus } from "./../transaction/transaction.interface";
import { NextFunction, Request, Response } from "express";
import ResponseHandler from "../../lib/helpers/responseHandler";
import adminModel from "./admin.model";

export class AdminController{
    public addNewAdmin = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          responseHandler.reqRes(req, res).onFetch("ADDED", await adminModel.addNewAdmin(req.userId,req.body)).send();
        } catch (e) {
            console.log(e);
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };
      public convertToSuperAdmin = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          responseHandler.reqRes(req, res).onFetch("CONVERTED", await adminModel.convertToSuperAdmin(req.userId,req.params.adminId)).send();
        } catch (e) {
            console.log(e);
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };
      public convertToNormalAdmin = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          responseHandler.reqRes(req, res).onFetch("CONVERTED", await adminModel.convertToNormalAdmin(req.userId,req.params.adminId)).send();
        } catch (e) {
            console.log(e);
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      }
      public fetchAdmins = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          responseHandler.reqRes(req, res).onFetch("FETCHED", await adminModel.fetchAdmins()).send();
        } catch (e) {
            console.log(e);
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };
      public removeAdmin = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          responseHandler.reqRes(req, res).onFetch("ADDED", await adminModel.removeAdmin(req.userId,req.params.adminId)).send();
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
      public devicesList = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          responseHandler.reqRes(req, res).onFetch("DEVICES_FETCHED", await adminModel.devicesList(req.userId)).send();
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


      // strip

      public addProduct = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          responseHandler.reqRes(req, res).onFetch("PRODUCT_ADDED", await adminModel.addProduct(req.userId,req.body)).send();
        } catch (e) {
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };

      public getProducts = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          responseHandler.reqRes(req, res).onFetch("PRODUCTS_FETCHED", await adminModel.getProducts(req.userId,req.query.limit as string)).send();
        } catch (e) {
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };

      public createPrice = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          responseHandler.reqRes(req, res).onFetch("PRICE_CREATED", await adminModel.createPrice(req.userId,req.body)).send();
        } catch (e) {
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };

      public getPrices = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          responseHandler.reqRes(req, res).onFetch("PRICES_FETCHED", await adminModel.getPrices(req.userId,req.query.limit as string)).send();
        } catch (e) {
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };

      public fetchPaymentRequests = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          responseHandler.reqRes(req, res).onFetch("PAYMENTS_FETCHED", await adminModel.fetchPaymentsRequests(req.userId,req.params.status as ETransactionStatus,req.query.page as string)).send();
        } catch (e) {
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };

      public approvePayment = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          responseHandler.reqRes(req, res).onFetch("PAYMENT APPROVED", await adminModel.approvePayment(req.userId,req.params.paymentId)).send();
        } catch (e) {
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };

      public rejectPayment = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          responseHandler.reqRes(req, res).onFetch("PAYMENT REJECTED", await adminModel.rejectPayment(req.userId,req.params.paymentId,req.body.reason)).send();
        } catch (e) {
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };
      public sendEmail = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          responseHandler.reqRes(req, res).onFetch("MAIL SENT", await adminModel.sendEmail(req.userId,req.body.to,req.body.subject,req.body.message)).send();
        } catch (e) {
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };

      public fetchEmails = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          responseHandler.reqRes(req, res).onFetch("MAIL SENT", await adminModel.fetchEmails(req.userId,req.query.active as string)).send();
        } catch (e) {
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };

      public fetchAllTransactions = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          responseHandler.reqRes(req, res).onFetch("TRANSACTION FETCHED", await adminModel.fetchAllTransactions(req.userId,req.query.status as ETransactionStatus,req.query.type as ETransactionTypes,req.query.method as EPayWith,parseInt(req.query.page as string || "1"))).send();
        } catch (e) {
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };
}



export default new AdminController();