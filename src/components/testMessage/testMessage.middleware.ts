import { HTTP401Error } from './../../lib/utils/httpErrors';
import { Request, Response ,NextFunction} from "express";
import testMessageModel from "./testMessage.model";
import { ITestMessageModel } from './testMessage.schema';
import { ITestMessage } from './testMessage.interface';
import { testMessageConfig } from '../../config';
import { validateMobile } from '../../lib/utils';


export const validateTestMessageRequest = async(req:Request,res:Response,next:NextFunction)=>{
    const to = req.body?.to;
    if(!validateMobile(to)) throw new HTTP401Error("INVALID_PHONE");
    const testMessage:ITestMessageModel = await testMessageModel.fetchTestMessageByPhoneNumber(to);
    if(testMessage){
        req.testMessageId = testMessage._id;
        if(testMessage.messageCount<testMessageConfig.maxMessage){
            return next();
        }
        throw new HTTP401Error("LIMIT_REACHED");
    }
    req.testMessageId = null;

    return  next();
}