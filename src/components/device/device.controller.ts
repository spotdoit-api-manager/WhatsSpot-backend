import { IMessage } from "./../messages/message.interface";
import { NextFunction, Request, Response } from "express";
import ResponseHandler from "../../lib/helpers/responseHandler";
import deviceModel from "./device.model";
import messageModel from "../messages/message.model";

export class DeviceController {
  public newDevice = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const responseHandler = new ResponseHandler();
    try {
      console.log("new device request");

      responseHandler
        .reqRes(req, res)
        .onFetch("DEVICE_ADDED", await deviceModel.newDevice(req.userId,req.walletId,req.body,req.params.code))
        .send();
    } catch (e) {
      // send error with next function.
      next(responseHandler.sendError(e));
    }
  };

  public newDeviceCode = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const responseHandler = new ResponseHandler();
    try {

      responseHandler
        .reqRes(req, res)
        .onFetch("CODE_SENT", await deviceModel.newDeviceCode(req.userId,req.walletId,req.body))
        .send();
    } catch (e) {
      // send error with next function.
      next(responseHandler.sendError(e));
    }
  };


  public getQr = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      console.log("qr request");

      responseHandler.reqRes(req, res).onFetch("QR_REQUESTED", await deviceModel.getQr(req.params)).send();
    } catch (e) {
      // send error with next function.
      next(responseHandler.sendError(e));
    }
  };

  public removeClient = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      console.log("qr request");

      responseHandler.reqRes(req, res).onFetch("QR_REQUESTED", await deviceModel.removeClient(req.params)).send();
    } catch (e) {
      // send error with next function.
      next(responseHandler.sendError(e));
    }
  };

  public fetchAllDevices = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      console.log("fetch all device request");

      responseHandler.reqRes(req, res).onFetch("DEVICES_FETCHED", await deviceModel.fetchAllDevices(req.userId)).send();
    } catch (e) {
      // send error with next function.
      next(responseHandler.sendError(e));
    }
  };

  public fetchDevice = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      console.log("qr request");

      responseHandler.reqRes(req, res).onFetch("DEVICE_FETCHED", await deviceModel.fetchDevice(req.params.deviceId, req.userId)).send();
    } catch (e) {
      // send error with next function.
      next(responseHandler.sendError(e));
    }
  };
  public deleteAuth = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      console.log("qr request");

      responseHandler.reqRes(req, res).onFetch("AUTH_DELETED", await deviceModel.deleteAuth(req.params)).send();
    } catch (e) {
      // send error with next function.
      next(responseHandler.sendError(e));
    }
  };

  public logoutDevice = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      console.log("qr request");

      responseHandler.reqRes(req, res).onFetch("DEVICE_LOGGEDOUT", await deviceModel.logoutDevice(req.params)).send();
    } catch (e) {
      // send error with next function.
      next(responseHandler.sendError(e));
    }
  };
  public generateNewKey = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      console.log("qr request");

      responseHandler.reqRes(req, res).onFetch("KEY_GENERATED", await deviceModel.generateNewKey(req.userId,req.walletId,req.params.deviceId, req.body)).send();
    } catch (e) {
      // send error with next function.
      next(responseHandler.sendError(e));
    }
  };
  public getKeys = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      console.log("qr request");

      responseHandler.reqRes(req, res).onFetch("KEYS_FETCHED", await deviceModel.getKeys(req.params.deviceId)).send();
    } catch (e) {
      // send error with next function.
      next(responseHandler.sendError(e));
    }
  };
  public deleteKey = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      console.log("delete key request", req.params);

      responseHandler.reqRes(req, res).onFetch("KEY_DELETED", await deviceModel.deleteKey(req.params.deviceId, req.params.keyId)).send();
    } catch (e) {
      // send error with next function.
      next(responseHandler.sendError(e));
    }
  };
  public addMessageToQueue = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      console.log("add to queue request ", req.params);

      responseHandler.reqRes(req, res).onFetch("ADDED_TO_QUEUE", await messageModel.addMessageToQueue(req.userId,req.body, req.params.deviceId)).send();
    } catch (e) {
      // send error with next function.
      next(responseHandler.sendError(e));
    }
  };

  public retryFailedMessage = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      const result = await deviceModel.retryFailedMessage(req.userId,req.params.deviceId);
      console.log("retry result ",result);
      
      responseHandler.reqRes(req, res).onFetch("RETRYING",result ).send();
    } catch (e) {
      // send error with next function.
      next(responseHandler.sendError(e));
    }
  };

  public sendTextMessage = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      console.log("Send text message request");

      responseHandler.reqRes(req, res).onFetch("MESSAGE_SENT", await messageModel.sendMessage(req.userId,req.body.to,req.body.message,req.body.messageType, req.params.deviceId,req.walletId)).send();
    } catch (e) {
      // send error with next function.
      next(responseHandler.sendError(e));
    }
  };


  public sendImageMessage = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      console.log("qr request");
      req.body.locationUrl = req.file.location;

      responseHandler.reqRes(req, res).onFetch("SENT_MESSAGE", await messageModel.sendImageMessage(req.body, req.params.deviceId)).send();
    } catch (e) {
      // send error with next function.
      next(responseHandler.sendError(e));
    }
  };


  public fetchPrevMessages = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      console.log("fetch prev message");

      responseHandler.reqRes(req, res).onFetch("Fetched", await deviceModel.fetchPrevMessages(req.params.deviceId)).send();
    } catch (e) {
      // send error with next function.
      next(responseHandler.sendError(e));
    }
  };

  public fetchDeviceMetrics = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      console.log("fetch prev message");

      responseHandler.reqRes(req, res).onFetch("Fetched", await deviceModel.fetchDeviceMetrics(req.params.deviceId)).send();
    } catch (e) {
      // send error with next function.
      next(responseHandler.sendError(e));
    }
  };
}


export default new DeviceController();
