import { NextFunction, Request, Response } from "express";
import {  } from "../../lib/services/exchange-rate.service";
import ResponseHandler from "../../lib/helpers/responseHandler";
import webhooksModel from "./webhooks.model";

export class WebhookController{
    public fetchWebhooksMessage = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        
        try {
         const result =  await webhooksModel.fetchWebhookMessages(req.userId,req.query?.deviceId as string,parseInt((req.query?.page as string) ||"1"));
          responseHandler.reqRes(req, res).onCreate("WEBHOOK_MESSAGES_FETCHED",result).send();
        } catch (e) {
          next(responseHandler.sendError(e));
        }
      }

}

export default new WebhookController();