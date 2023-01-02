import { NextFunction, Request, Response } from "express";
import { EWhatsappMessageTypes } from "../../lib/services/whatsapp/whatsapp.enum";
import ResponseHandler from "../../lib/helpers/responseHandler";
import testMessageModel from "../testMessage/testMessage.model";
import messageModel from "./message.model";
const logFileName = "[MessageController]";
export class MessageController{

  public  queueTextMessage =async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      req.body.messageType = EWhatsappMessageTypes.TEXT_MESSAGE;
      responseHandler.reqRes(req, res).onFetch("ADDED_TO_QUEUE", await messageModel.addMessageToQueue(req.userId,req.body, req.deviceId)).send();
    } catch (e) {
      // send error with next function.
      next(responseHandler.sendError(e));
    }
  }

  public  queueListMessage =async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      req.body.messageType = EWhatsappMessageTypes.LIST_MESSAGE;
      responseHandler.reqRes(req, res).onFetch("ADDED_TO_QUEUE", await messageModel.addMessageToQueue(req.userId,req.body, req.deviceId)).send();
    } catch (e) {
      // send error with next function.
     console.log(e);
      next(responseHandler.sendError(e));
    }
  }

  public  queueBtnMessage =async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      req.body.messageType = EWhatsappMessageTypes.BUTTON_MESSAGE;
      responseHandler.reqRes(req, res).onFetch("ADDED_TO_QUEUE", await messageModel.addMessageToQueue(req.userId,req.body, req.deviceId)).send();
    } catch (e) {
      // send error with next function.
      next(responseHandler.sendError(e));
    }
  }

  public queueTemplateMessage = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      req.body.messageType = EWhatsappMessageTypes.TEMPLATE_MESSAGE;
      responseHandler.reqRes(req, res).onFetch("ADDED_TO_QUEUE", await messageModel.addMessageToQueue(req.userId,req.body, req.deviceId)).send();
    } catch (e) {
      // send error with next function.
      next(responseHandler.sendError(e));
    }
  }
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


      public fastText = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          req.body.messageType = EWhatsappMessageTypes.TEXT_MESSAGE;    
          responseHandler.reqRes(req, res).onFetch("MESSAGE_SENT", await messageModel.sendFastMessage(req.userId,req.body.numbers,req.body.message,req.body.messageType,req.deviceId,req.walletId)).send();
        } catch (e) {
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };

      public fastList = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          req.body.messageType = EWhatsappMessageTypes.LIST_MESSAGE;    
          responseHandler.reqRes(req, res).onFetch("MESSAGE_SENT", await messageModel.sendFastMessage(req.userId,req.body.numbers,req.body.message,EWhatsappMessageTypes.LIST_MESSAGE,req.deviceId,req.walletId)).send();
        } catch (e) {
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };

      public fastBtn = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          req.body.messageType = EWhatsappMessageTypes.BUTTON_MESSAGE;    
          responseHandler.reqRes(req, res).onFetch("MESSAGE_SENT", await messageModel.sendFastMessage(req.userId,req.body.numbers,req.body.message,EWhatsappMessageTypes.BUTTON_MESSAGE,req.deviceId,req.walletId)).send();
        } catch (e) {
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };

      public fastTemplate = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          req.body.messageType = EWhatsappMessageTypes.TEMPLATE_MESSAGE;    
          responseHandler.reqRes(req, res).onFetch("MESSAGE_SENT", await messageModel.sendFastMessage(req.userId,req.body.numbers,req.body.message,EWhatsappMessageTypes.TEMPLATE_MESSAGE,req.deviceId,req.walletId)).send();
        } catch (e) {
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };


    
      
      public sendTextMessage = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          console.log("Send text message request",req.userId,req.walletId,req.deviceId);
    
          responseHandler.reqRes(req, res).onFetch("MESSAGE_SENT", await messageModel.sendMessage(req.userId,req.body.to,req.body.message,EWhatsappMessageTypes.TEXT_MESSAGE,req.deviceId,req.walletId)).send();
        } catch (e) {
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };

      public fastImageBtn = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          req.body.messageType = EWhatsappMessageTypes.TEMPLATE_MESSAGE;    
          responseHandler.reqRes(req, res).onFetch("MESSAGE_SENT", await messageModel.sendFastMessage(req.userId,req.body.numbers,req.body.message,EWhatsappMessageTypes.IMAGE_BUTTON_MESSAGE,req.deviceId,req.walletId)).send();
        } catch (e) {
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };

      public fastImageTemplate = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          req.body.messageType = EWhatsappMessageTypes.TEMPLATE_MESSAGE;    
          responseHandler.reqRes(req, res).onFetch("MESSAGE_SENT", await messageModel.sendFastMessage(req.userId,req.body.numbers,req.body.message,EWhatsappMessageTypes.IMAGE_TEMPLATE_MESSAGE,req.deviceId,req.walletId)).send();
        } catch (e) {
          console.log(e);
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
    
      public sendRawMessage = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          console.log("Send raw message request",req.body.deviceId,req.body.message);
    
          responseHandler.reqRes(req, res).onFetch("MESSAGE_SENT", await testMessageModel.sendRawMessage(req.body.to,req.body.message)).send();
        } catch (e) {
          // send error with next function.
          console.log(e);
          next(responseHandler.sendError(e));
        }
      };
}

export default new MessageController();