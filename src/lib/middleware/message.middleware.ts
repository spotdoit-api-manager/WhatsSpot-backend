import { IWhatsappButtonMessageButton,IWhatsappListSectionRow,IWhatsappListSection, ITemplateButtons, ICallButton, IURLButton, IQuickReplyButton } from "./../services/whatsapp/whatsapp.interface";
import { NextFunction, Request, Response } from "express";
import { HTTP401Error } from "../utils/httpErrors";
import { isWhatsappTextMessageType,isWhatsappButtonMessageType,isWhatsappListMessageType, isWhatsappTemplateMessageType } from "../validators/message.validator";
import { EWhatsappMessageTypes } from "./../services/whatsapp/whatsapp.enum";
import logger from "../../core/logger";

const logFileName = "[MessageMiddleware]";
export const validateTextMessage = (req: Request, res: Response, next: NextFunction) => {
    const message = req.body.message;
    const valid = isWhatsappTextMessageType(message);
    if (valid.valid) {
        next();
    }else{
        throw new HTTP401Error(valid.message,"Please check provided message format is valid");
    }
}; 

export const validateListMessage = (req: Request, res: Response, next: NextFunction) => {
    req.body?.message?.sections?.forEach((section: IWhatsappListSection,sectionIndex: number)=>{ //adding row Id to each row of  each sections
        section?.rows?.forEach((row: IWhatsappListSectionRow,rowIndex: number)=>{
            row.rowId=`r${sectionIndex}${rowIndex}`;
        });
    });
    const message = req.body.message;
    const valid = isWhatsappListMessageType(message);
    if (valid.valid) {
        next();
    }else{
        throw new HTTP401Error(valid.message,"Please check provided message format is valid");
    }
}; 

export const validateBtnMessage = (req: Request, res: Response, next: NextFunction) => {
    req.body.message.headerType = 1;
    req.body?.message?.buttons?.forEach((button: IWhatsappButtonMessageButton,btnIndex: number)=>{
        button.type=1;
        button.buttonId = `btn${btnIndex}`;
    });
    const message = req.body.message;
    logger.info(logFileName,message);
    const valid = isWhatsappButtonMessageType(message);
    if (valid.valid) {
        next();
    }else{
        throw new HTTP401Error(valid.message,"Please check provided message format is valid");
    }
}; 

export const validateTemplateMessage = (req: Request, res: Response, next: NextFunction) => {

    req.body.message.templateButtons.forEach((button: ITemplateButtons,index: number)=>{
        button.index = index+1;
        if(button.hasOwnProperty("quickReplyButton")){
            (button as IQuickReplyButton).quickReplyButton.id = `button${index+1}`;
        }
    });
    const message = req.body.message;
    logger.info(message);
    const valid = isWhatsappTemplateMessageType(message);
    if (valid.valid) {
        next();
    }else{
        throw new HTTP401Error(valid.message,"Please check provided message format is valid");
    }  
};