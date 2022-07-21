import { deSanatizeMobile } from "./index";
import { HTTP400Error } from "./httpErrors";
import {
    parsePhoneNumberWithError, CountryCode ,PhoneNumber, parsePhoneNumber
  } from "libphonenumber-js/max";

  
import logger from "../../core/logger";
const logFileName = "[PhoneHandler] : ";
  export const parsePhoneWithCountry = (phone: string,country: CountryCode)=>{
        try{
            const parsedPhone: PhoneNumber =  parsePhoneNumberWithError(phone,country);
            if(!parsedPhone.isValid()) throw new Error("INVALID_PHONE");
            return {number: parsedPhone.number};
        }catch(e){
            logger.error(logFileName,e.message);
            throw new HTTP400Error(e.message);
        }
  };

  export const parsePhone = (phone: string)=>{
    try{
      // console.log("parsing phone",phone);
      phone = deSanatizeMobile(phone);
        const parsedPhone: PhoneNumber =  parsePhoneNumber(deSanatizeMobile(phone));        
        if(!parsedPhone.isValid()) throw new Error(`Phone ${phone} is invalid`);
        return {number: parsedPhone.number};
    }catch(e){
        logger.error(logFileName,e.message +`at ${phone}`);
        throw new HTTP400Error(e.message,`Not a valid number at ${phone}`);
    }
  };