import {
    isPossiblePhoneNumber,
    isValidPhoneNumber,
    validatePhoneNumberLength,
    parsePhoneNumberWithError, ParseError, CountryCode 
  } from "libphonenumber-js";
import logger from "../../core/logger";
const logFileName = "[PhoneHandler] : ";
  export const parsePhone = (phone: string,country: CountryCode)=>{
        try{
            return parsePhoneNumberWithError(phone,country);
        }catch(e){
            logger.error(logFileName,e.message);
            throw new Error("Invalid phone number");
        }
  };