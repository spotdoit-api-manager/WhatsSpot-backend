import { stripeConfig } from "./../../config/index";
import { NextFunction, Request, Response } from "express";
import ResponseHandler from "../../lib/helpers/responseHandler";
import stripeModel from "./stripe.model";

  export const  validateStripeEvent = async (req: Request,res: Response,next: NextFunction)=>{
    const responseHandler = new ResponseHandler();

    const sig = req.header("stripe-signature");
    console.log("signature is ",sig);
    console.log("body is",req.body);
    console.log("secret is",stripeConfig.webhookSecretKey);
    try {
      const event = await stripeModel.validateSignature(req.body,sig,stripeConfig.webhookSecretKey) ;
      req.body = event;
      next();
    } catch (err) {
        console.log("error in webhook event",err);
        next(responseHandler.sendError(err));
    }
  };