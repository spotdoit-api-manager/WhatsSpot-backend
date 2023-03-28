
import { NextFunction, Request, Response } from "express";
import ResponseHandler from "../../lib/helpers/responseHandler";
import configsModel from "./configs.model";

export class ContactController{
    public getConfigs = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          responseHandler.reqRes(req, res).onFetch("Config Fetched", await configsModel.getConfigs(req.userId)).send();
        } catch (e) {
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };
      public updateConfigs = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        try {
          responseHandler.reqRes(req, res).onFetch("Config Updated", await configsModel.updateConfigs(req.userId,req.body)).send();
        } catch (e) {
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };
}

export default new ContactController();