import { NextFunction, Request, Response } from "express";

const redis = require("async-redis");
const client = redis.createClient();
const maxOtpRequest = 3;
const perNMin = 5;
export const otpMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
  const { phone } = req.body;  // could be ip as well, ip = req.ip;
  const keyName = phone;
  const current = await client.get(phone);
  if (current && current > maxOtpRequest) {
    throw new Error("Too many requests, please try after sometime!");
  } else {
    await client.multi()
      .incr(keyName)
      .expire(keyName, perNMin*60) // number of seconds
      .exec();
    next();
  }
};