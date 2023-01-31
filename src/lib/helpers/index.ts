import {HTTP400Error} from "../utils/httpErrors";
import jwt from "jsonwebtoken";
import {commonConfig, s3Config} from "../../config";
/* All common helpers will come here */

/**
 * 4 digit otp generator.
 */
export const otpGenerator = (): number => Math.floor(1000 + Math.random() * 9000);

/**
 * **Crete new token**
 * ? This will create new jwt token for users every time.
 * @param user user Information here
 */
export const generateToken = async (user: any) => jwt.sign({user}, commonConfig.jwtSecretKey);


/**
 * This will convert valid timestamp into h:m AM/PM date MonthName
 * ? for example::  10:47 PM 26 May
 * @param time Timestamp
 */
// export const postTime = (time: string)=>{
//   const monthArr: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//   const hrs = new Date(time).getHours();
//   return `${hrs > 12? hrs-12 : hrs}:${new Date(time).getMinutes()} ${hrs > 12 ? "PM" : "AM"}, ${new Date(time).getDate()} ${monthArr[ new Date(time).getMonth()]}`;
// }

export const takeYMD = (time: string) => {
  const date = new Date(time);
  return `${date.getFullYear()}-${checkTime(date.getMonth() + 1)}-${checkTime(date.getDate())}`;
};


const checkTime = (data: number) => {
  return data > 9 ? data : `0${data}`;
};

export const imageUrl = (imgPath: string | string[]) => {
  const regEx = /^http/i;
  if (!imgPath || regEx.test(imgPath as string)) {
    return imgPath;
  }
  return (typeof imgPath === "string" ?
    `${s3Config.url}${imgPath}` :
    imgPath.map((el: string) => regEx.test(el) ? el : `${s3Config.url}${el}`));
};

export const skipLimitOnPage = (page: number = 1): { skip: number; limit: number } => {
  if (isNaN(page)) {
    throw new HTTP400Error("please provide a paging to this api in query string:: ?page=<positive number>");
  }
  page = page < 1 ? 1 : page;

  const pageLimit: any = commonConfig.pageSizeLimit;
  return {skip: pageLimit * (page - 1), limit: pageLimit};
};

export const getTime = (date: string) => {
  return new Date(date).toLocaleString("en-US", {hour: "numeric", minute: "numeric", hour12: true});
};

export const getNextDate = (day: number = 2) => {
  return new Date(new Date().getTime() + day * 24 * 60 * 60 * 1000);
};

export const isValidMongoId = (str: string) => {
  if(!str || typeof str !== "string" || str=="") return false;
  if(!str.match(/^[a-f\d]{24}$/i)) throw new HTTP400Error("Invalid Id");
  return ;
};

export const pruneFields = (body: any, fields: string) => {
  const fieldsArray = fields.split(" ");
  fieldsArray.forEach(field => {
    delete body[field];
  });
};
