import { IMessage } from './../messages/message.interface';
import { NextFunction, Request, Response } from "express";
import ResponseHandler from "../../lib/helpers/responseHandler";
import deviceModel from "./device.model";

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
        .onFetch("new device", await deviceModel.newDevice(req.body, req.userId))
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

      responseHandler.reqRes(req, res).onFetch("qr requestd", await deviceModel.getQr(req.params)).send();
    } catch (e) {
      // send error with next function.
      next(responseHandler.sendError(e));
    }
  };

  public fetchAllDevices = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      console.log("fetch all device request");

      responseHandler.reqRes(req, res).onFetch("Devices fetched", await deviceModel.fetchAllDevices(req.userId)).send();
    } catch (e) {
      // send error with next function.
      next(responseHandler.sendError(e));
    }
  };

  public fetchDevice = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      console.log("qr request");

      responseHandler.reqRes(req, res).onFetch("Devices fetched", await deviceModel.fetchDevice(req.params.deviceId, req.userId)).send();
    } catch (e) {
      // send error with next function.
      next(responseHandler.sendError(e));
    }
  };
  public deleteAuth = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      console.log("qr request");

      responseHandler.reqRes(req, res).onFetch("auth deleted", await deviceModel.deleteAuth(req.params)).send();
    } catch (e) {
      // send error with next function.
      next(responseHandler.sendError(e));
    }
  };

  public logoutDevice = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      console.log("qr request");

      responseHandler.reqRes(req, res).onFetch("auth deleted", await deviceModel.logoutDevice(req.params)).send();
    } catch (e) {
      // send error with next function.
      next(responseHandler.sendError(e));
    }
  };
  public addMessageToQueue = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      console.log("qr request");

      responseHandler.reqRes(req, res).onFetch("added to queue", await deviceModel.addMessageToQueue(req.body, req.params.deviceId)).send();
    } catch (e) {
      // send error with next function.
      next(responseHandler.sendError(e));
    }
  };

  public sendTextMessage = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler();
    try {
      console.log("qr request");

      responseHandler.reqRes(req, res).onFetch("sent", await deviceModel.sendTextMessage(req.body, req.params.deviceId)).send();
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

      responseHandler.reqRes(req, res).onFetch("sent", await deviceModel.sendImageMessage(req.body, req.params.deviceId)).send();
    } catch (e) {
      // send error with next function.
      next(responseHandler.sendError(e));
    }
  };

}


export default new DeviceController();
