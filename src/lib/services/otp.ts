import { sanatizeMobile } from '../utils/index';
import axios from 'axios';
import {textLocalConfig} from "../../config";
import  OTPMessagesService  from './otp-message.service';

export const sendMessage = async (to: string, message: string) => {
  const env = process.env.NODE_ENV;
  if(env=='development') return {proceed:true};
  return await OTPMessagesService.sendFast2Sms(sanatizeMobile(to),message);
};
