import { sanatizeMobile } from "../utils/index";
import  OTPMessagesService  from "./otp-message.service";
import logger from "../../core/logger";
import { parseNumber } from "libphonenumber-js";

const logFileName = "[OTPHandler] : ";
export const sendMessage = async (to: string, message: string) => {
  const env = process.env.NODE_ENV;
  const phone: any = parseNumber(to);
  OTPMessagesService.sendWhatsappMessage(to,message);
  if(env=="development") return {proceed:true};
  if(phone.country=="IN"){
    return await OTPMessagesService.sendFast2Sms(sanatizeMobile(phone.phone),message);
  }else{
    logger.info(`Mobile SMS not supported for ${phone?.country}`);
  }
};


export const sendNewDeviceCode = async (to: string,otp: number) => {
  const env = process.env.NODE_ENV;
  const message = `Your Device verification code is ${otp}`;
  logger.info(logFileName,message);
  OTPMessagesService.sendWhatsappMessage(sanatizeMobile(to),message);
  const phone: any = parseNumber(to);
  console.log(phone);
  if(env=="development") return {proceed:true};
  if(phone.country=="IN"){
    return await OTPMessagesService.sendFast2Sms(sanatizeMobile(phone.phone),message);
  }else{
    logger.info(`Mobile SMS not supported for ${phone?.country}`);
  }
};
