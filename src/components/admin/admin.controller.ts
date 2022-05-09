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
    
}



export default new AdminController();