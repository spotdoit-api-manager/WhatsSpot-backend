import {
    parsePhoneNumberWithError, CountryCode ,PhoneNumber, parsePhoneNumber
  } from "libphonenumber-js/max";

  
import logger from "../../core/logger";
const logFileName = "[PhoneHandler] : ";
  export const parsePhoneWithCountry = (phone: string,country: CountryCode)=>{
        try{
          console.log(phone,country);
            const parsedPhone: PhoneNumber =  parsePhoneNumberWithError(phone,country);
            if(!parsedPhone.isValid()) throw new Error("INVALID_PHONE");
            return {number: parsedPhone.number};
        }catch(e){
            logger.error(logFileName,e.message);
            throw new Error(e.message);
        }
  };

  export const parsePhone = (phone: string)=>{
    try{
        const parsedPhone: PhoneNumber =  parsePhoneNumber(phone);
        console.log("parsed phone is  ",parsedPhone);
        
        if(!parsedPhone.isValid()) throw new Error(`Phone ${phone} is invalid`);
        return {number: parsedPhone.number};
    }catch(e){
        logger.error(logFileName,e.message +`at ${phone}`);
        throw new Error(e.message+` at ${phone}`);
    }
  };