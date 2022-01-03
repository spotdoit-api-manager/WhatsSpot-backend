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
        .onFetch("new device", await deviceModel.newDevice(req.body))
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

}


export default new DeviceController();
