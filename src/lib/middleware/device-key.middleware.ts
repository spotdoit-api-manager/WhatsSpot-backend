import { IDeviceTokenData } from "../../components/device/device.interface";
import { deviceKeyConfig } from "../../config/index";
import { Device, IDeviceModel } from "../../components/device/device.schema";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import deviceModel from "../../components/device/device.model";
import { HTTP401Error } from "../utils/httpErrors";
import logger from "../../core/logger";
const logFileName = "[WhatsappMiddleWare]";


const handleToken = async (token: string) => {
    if (token) {
        const tokenData: IDeviceTokenData = await jwt.verify(token, deviceKeyConfig.jwtSecretKey) as IDeviceTokenData;
        const isValidToken: any = await Device.findOne({_id:tokenData.deviceId,"apiKeys.token":token});
        if(!isValidToken) throw new HTTP401Error("TOKEN_REMOVED","The api key is deleted by user please generate new api key on dashboard");
       return tokenData;
    } else {
        // tslint:disable-next-line: no-string-throw
        throw new HTTP401Error("Api key not provided");
    }
};

export const DeviceKeyValidator = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req?.headers?.authorization) {
            const token: string = req.headers.authorization.split(" ")[1];
            const tokenData: IDeviceTokenData = await handleToken(token);            
            if (tokenData) {
                req.deviceId = tokenData.deviceId;
                req.userId =tokenData.userId;
                req.walletId = tokenData.walletId;
                next();
            }
        } else {
            throw new HTTP401Error("INVALID_KEY", "You may have not passed the api key in parameters");
        }
    } catch (e) {
        e = new HTTP401Error(e.message, e.description || "You may have not passed the authorization key in header");
        next(e);
    }
};
