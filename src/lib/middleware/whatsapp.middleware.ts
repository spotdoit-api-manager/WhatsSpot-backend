import { IDeviceTokenData } from './../../components/device/device.interface';
import { deviceKeyConfig } from './../../config/index';
import { IDeviceModel } from './../../components/device/device.shema';
import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import deviceModel from '../../components/device/device.model';
import { HTTP401Error } from '../utils/httpErrors';

export const DeviceKeyValidator = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.query) {
            const token: string = req.query.key;
            const data: IDeviceModel = await handleToken(token, req.userId);
            if (data) {
                req.deviceId = data._id;
                next();
            }
        } else {
            throw new HTTP401Error("Invalid Key", "You may have not passed the api key in parameters");
        }
    } catch (e) {
        e = new HTTP401Error(e.message, "You may have not passed the authorization key in header");
        next(e);
    }
};

const handleToken = async (token: string, userId: string) => {
    if (token) {
        const tokenData: IDeviceTokenData = await jwt.verify(token, deviceKeyConfig.jwtSecretKey) as IDeviceTokenData;
        const data: any = await deviceModel.findDeviceByIdAndUserId(tokenData.deviceId, userId);
        if (data && data._id) {
            return data;
        } else {
            throw new HTTP401Error("Invalid api key...")
        }
    } else {
        // tslint:disable-next-line: no-string-throw
        throw new HTTP401Error("Api key not provided");
    }
};
