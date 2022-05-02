import { sanatizeMobile } from "../utils/index";
import axios from "axios";
import {textLocalConfig} from "../../config";
import  OTPMessagesService  from "./otp-message.service";
import { otpGenerator } from "../helpers";
import logger from "../../core/logger";

const logFileName = "[OTPHandler] : ";
export const sendMessage = async (to: string, message: string) => {
  const env = process.env.NODE_ENV;
  if(env=="development") return {proceed:true};
  return await OTPMessagesService.sendFast2Sms(sanatizeMobile(to),message);
};


export const sendNewDeviceCode = async (to: string) => {
  const env = process.env.NODE_ENV;
  const otp = otpGenerator();
  const message = `Your Device verification code is ${otp}`;
  logger.info(logFileName,message);
  if(env=="development") return {proceed:true};
  return await OTPMessagesService.sendFast2Sms(sanatizeMobile(to),message);
};
