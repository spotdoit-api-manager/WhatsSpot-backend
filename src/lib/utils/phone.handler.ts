import {
    parsePhoneNumberWithError, CountryCode ,PhoneNumber, parsePhoneNumber
  } from "libphonenumber-js/max";

  
import logger from "../../core/logger";
const logFileName = "[PhoneHandler] : ";
  export const parsePhone = (phone: string,country: CountryCode)=>{
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