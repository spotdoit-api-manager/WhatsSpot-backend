import { NextFunction, Request, Response } from "express";
import ResponseHandler from "../../lib/helpers/responseHandler";
import testMessageModel from "../testMessage/testMessage.model";
import messageModel from "./message.model";

export class MessageController{
    public addToQueue = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          console.log("add to queue request ", req.params);
    
          responseHandler.reqRes(req, res).onFetch("ADDED_TO_QUEUE", await messageModel.addMessageToQueue(req.userId,req.body, req.deviceId)).send();
        } catch (e) {
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };

      public sendFastMessage = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          console.log("Send fast text message request",req.userId,req.walletId,req.deviceId);
    
          responseHandler.reqRes(req, res).onFetch("MESSAGE_SENT", await messageModel.sendFastTextMessage(req.userId,req.body.to,req.body.message,req.deviceId,req.walletId)).send();
        } catch (e) {
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };

      
      public sendTextMessage = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          console.log("Send text message request",req.userId,req.walletId,req.deviceId);
    
          responseHandler.reqRes(req, res).onFetch("MESSAGE_SENT", await messageModel.sendTextMessage(req.userId,req.body.to,req.body.message,req.deviceId,req.walletId)).send();
        } catch (e) {
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };

      public sendTestMessage = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          console.log("Send test message request",req.userId,req.walletId,req.deviceId);
    
          responseHandler.reqRes(req, res).onFetch("MESSAGE_SENT", await testMessageModel.sendTestMessage(req.body,req.testMessageId)).send();
        } catch (e) {
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };
    
}

export default new MessageController();