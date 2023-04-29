"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pruneFields = exports.isValidMongoId = exports.getNextDate = exports.getTime = exports.skipLimitOnPage = exports.imageUrl = exports.takeYMD = exports.generateToken = exports.otpGenerator = void 0;
const httpErrors_1 = require("../utils/httpErrors");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config");
/* All common helpers will come here */
/**
 * 4 digit otp generator.
 */
const otpGenerator = () => Math.floor(1000 + Math.random() * 9000);
exports.otpGenerator = otpGenerator;
/**
 * **Crete new token**
 * ? This will create new jwt token for users every time.
 * @param user user Information here
 */
const generateToken = (user) => __awaiter(void 0, void 0, void 0, function* () { return jsonwebtoken_1.default.sign({ user }, config_1.commonConfig.jwtSecretKey); });
exports.generateToken = generateToken;
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
const takeYMD = (time) => {
    const date = new Date(time);
    return `${date.getFullYear()}-${checkTime(date.getMonth() + 1)}-${checkTime(date.getDate())}`;
};
exports.takeYMD = takeYMD;
const checkTime = (data) => {
    return data > 9 ? data : `0${data}`;
};
const imageUrl = (imgPath) => {
    const regEx = /^http/i;
    if (!imgPath || regEx.test(imgPath)) {
        return imgPath;
    }
    return (typeof imgPath === "string" ?
        `${config_1.s3Config.url}${imgPath}` :
        imgPath.map((el) => regEx.test(el) ? el : `${config_1.s3Config.url}${el}`));
};
exports.imageUrl = imageUrl;
const skipLimitOnPage = (page = 1) => {
    if (isNaN(page)) {
        throw new httpErrors_1.HTTP400Error("please provide a paging to this api in query string:: ?page=<positive number>");
    }
    page = page < 1 ? 1 : page;
    const pageLimit = config_1.commonConfig.pageSizeLimit;
    return { skip: pageLimit * (page - 1), limit: pageLimit };
};
exports.skipLimitOnPage = skipLimitOnPage;
const getTime = (date) => {
    return new Date(date).toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
};
exports.getTime = getTime;
const getNextDate = (day = 2) => {
    return new Date(new Date().getTime() + day * 24 * 60 * 60 * 1000);
};
exports.getNextDate = getNextDate;
const isValidMongoId = (str) => {
    console.log("id validate:", str);
    if (!str || typeof str !== "string" || str == "")
        throw new httpErrors_1.HTTP400Error("Invalid Id Type");
    if (!str.match(/^[a-f\d]{24}$/i))
        throw new httpErrors_1.HTTP400Error("Invalid Id");
    return;
};
exports.isValidMongoId = isValidMongoId;
const pruneFields = (body, fields) => {
    const fieldsArray = fields.split(" ");
    fieldsArray.forEach(field => {
        delete body[field];
    });
};
exports.pruneFields = pruneFields;
//# sourceMappingURL=index.js.map