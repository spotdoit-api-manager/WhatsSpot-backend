import { deSanatizeMobile } from "./index";
import { HTTP400Error } from "./httpErrors";
import {
    parsePhoneNumberWithError, CountryCode ,PhoneNumber, parsePhoneNumber
  } from "libphonenumber-js/max";

  
import logger from "../../core/logger";
const logFileName = "[PhoneHandler] : ";
  export const parsePhoneWithCountry = (phone: string,country: CountryCode)=>{
        try{
          // special case for brazil for 11 digit numbers
          if(country=="BR"){
            if(phone.length==10){
              phone = phone.substring(0,2) + "9" + phone.substring(2,10);
            }
          }
            const parsedPhone: PhoneNumber =  parsePhoneNumberWithError(phone,country);
            if(!parsedPhone.isValid()) throw new Error("INVALID_PHONE");
            if(country=="BR"){
              parsedPhone.number = parsedPhone.number.substring(0,parsedPhone.countryCallingCode.length+3) + parsedPhone.number.substring(parsedPhone.countryCallingCode.length+4,11+parsedPhone.countryCallingCode.length+1);
            }
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