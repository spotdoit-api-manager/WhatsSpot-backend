import { NextFunction, Request, Response } from "express";
import userModel from "./user.model";
import ResponseHandler from "../../lib/helpers/responseHandler";
import { user as msg } from "../../lib/helpers/customMessage";
import jwt from "jsonwebtoken";
import { commonConfig } from "../../config";
import { IUser } from "./user.interface";
import { IUserModel } from "./user.schema";
import { HTTP400Error } from "../../lib/utils/httpErrors";

class UserController {
  public fetchAll = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      responseHandler.reqRes(req, res).onFetch(msg.FETCH_ALL, await userModel.fetchAll()).send();
    } catch (e) {
      // send error with next function.
      next(responseHandler.sendError(e));
    }
  };

  public registerWithPhone = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      responseHandler.reqRes(req, res).onFetch("OTP_SENT", await userModel.registerWithPhone(req.body.phone,req.body.email,req.body.userName,req.body.country)).send();
    } catch (e) {
      // send error with next function.
      next(responseHandler.sendError(e));
    }
  };

  public loginWithPhone = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      responseHandler.reqRes(req, res).onFetch("OTP_SENT", await userModel.loginWithPhone(req.body.phone,req.body.country)).send();
    } catch (e) {
      // send error with next function.
      next(responseHandler.sendError(e));
    }
  };


  
  public resendOTP = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      responseHandler.reqRes(req, res).onFetch("OTP_SENT_AGAIN", await userModel.resendOTP(req.params.id,req.body)).send();
    } catch (e) {
      // send error with next function.
      next(responseHandler.sendError(e));
    }
  };



  public create = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      // const data =  await userModel.add(req.body);
      console.log(req.body);
      // res.set("X-Auth")
      responseHandler
        .reqRes(req, res)
        .onCreate(msg.CREATED, await userModel.add(req.body), msg.CREATED_DEC)
        .send();
    } catch (e) {
      console.log(e);
      next(responseHandler.sendError(e));
    }
  };

  public fetch = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      responseHandler.reqRes(req, res).onCreate(msg.CREATED, await userModel.fetch(req.params.id), msg.CREATED_DEC).send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      responseHandler.reqRes(req, res).onCreate(msg.UPDATED, await userModel.update(req.params.id, req.body)).send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();

    try {
      await userModel.delete(req.params.id);
      responseHandler.reqRes(req, res).onCreate(msg.UPDATED).send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  }


  public fetchAccountMetrics = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();

    try {
     const result = await userModel.getAccountMetrics(req.userId);
      responseHandler.reqRes(req, res).onCreate(msg.UPDATED,result).send();
    } catch (e) {
      console.log(e);
      next(responseHandler.sendError(e));
    }
  }





  //   public adminLogin = async (req: Request, res: Response, next: NextFunction) => {

  //     try {
  //       responseHandler
  //         .reqRes(req, res)
  //         .onFetch("The otp has been sent to your phone. Please verify", await userModel.login(req.body.phone, true))
  //         .send();
  //     } catch (e) {
  //       next(responseHandler.sendError(e));
  //     }
  //   };


  //   public searchUsers = async (req: Request, res: Response, next: NextFunction) => {

  //     try {
  //       responseHandler.reqRes(req, res).onFetch(`Here are users`, await userModel.searchUsers(req.query)).send();
  //     } catch (e) {
  //       next(responseHandler.sendError(e));
  //     }
  //   };


  public loginViaSocialAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      const data = await userModel.loginViaSocialAccessToken(req.query);

      // if user never existed then make user and save it to database
      responseHandler.reqRes(req, res).onCreate("Sign up Complete", data).send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };

  public socialAuthAddPhone = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      responseHandler.reqRes(req, res).onFetch("Phone Number added", await userModel.addPhone(req.query)).send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };

  public verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      const data = await userModel.verifyOtp(req.params.id, req.body.otp);
      res.setHeader("Set-Cookie", data.cookie);

      // res.set('X-Auth', data.token);
      responseHandler
        .reqRes(req, res)
        .onFetch("otp has been verified", { user: data.data, tokenData: data.tokenData }, "otp verified now you can go forward.")
        .send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };

  public getLoggedUser = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      console.log("getting logged user");
      
      const user = await userModel.fetch(req.userId);

      responseHandler.reqRes(req, res).onFetch("User Data", user).send();
    } catch (e) {
      responseHandler.sendError(e);
    }
  };

  public getActivePlan = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      // console.log("getting user active plan");
      
      const activePlan = await userModel.fetchUserActivePlan(req.userId);

      responseHandler.reqRes(req, res).onFetch("ACTIVE_PLAN", activePlan).send();
    } catch (e) {
      console.log(e);
      
      responseHandler.sendError(e);
    }
  };

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();

    try {
      const data = await userModel.signUp(req.body);

      responseHandler.reqRes(req, res).onCreate("Phone Number Added", data).send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };


  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      const user = await userModel.login(req.body);
      responseHandler.reqRes(req, res).onCreate("Login Successfully", user).send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };

 


  public isVerified = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      const data = await userModel.isUserVerified(req.userId);

      if (!data.proceed) {
        throw new HTTP400Error("NOTVERIFIED");
      }
      next();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };

  public generateOTP = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();

    try {
      const otp = await userModel.genrateOTP(req.body.phone);

      responseHandler.reqRes(req, res).onCreate("OTP sent", otp).send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  }

  public addPhoneNumber = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      const data = await userModel.addPhoneNumber(req.userId as string, req.query.phone as string);

      responseHandler.reqRes(req, res).onCreate("OTP Updated", data).send();
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  }

  public verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {

      if (req.body.otp) {
        const result = await userModel.verifyUser(req.body.otp.otp.toString(), req.userId);

        if (result.proceed) {
          responseHandler.reqRes(req, res).onCreate("User Verified", res).send();
        } else {
          throw Error("User Not Verified");
        }
      } else {
        throw new Error("OTP not found");
      }
    } catch (e) {
      next(responseHandler.sendError(e));
    }
  };
}

export default new UserController();

