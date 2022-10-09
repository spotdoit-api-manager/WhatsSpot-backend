/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { parsePhone } from "./../../lib/utils/phone.handler";
import { HTTP401Error } from "./../../lib/utils/httpErrors";
import { Request, Response, NextFunction } from "express";
import testMessageModel from "./testMessage.model";
import { ITestMessageModel } from "./testMessage.schema";
import { ITestMessage } from "./testMessage.interface";
import { testMessageConfig } from "../../config";
import { validateMobile } from "../../lib/utils";


export const validateTestMessageRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {


        const to = req.body?.to;
        
       try{
           req.body.to = parsePhone(to).number;
        }catch(e){
            const error = new HTTP401Error("INVALID_PHONE", "phone number is invalid");
            next(error);
        }
        const testMessage: ITestMessageModel = await testMessageModel.fetchTestMessageByPhoneNumber(to);
        if (testMessage) {
            req.testMessageId = testMessage._id;
            if (testMessage.messageCount < testMessageConfig.maxMessage) {
                return next();
            }
            const error = new HTTP401Error("LIMIT_REACHED", "You have sent maximum message to a number allowed");
            return next(error);
        }
        req.testMessageId = null;

        return next();
    } catch (e) {
        next(new HTTP401Error(e.message));
    }
};