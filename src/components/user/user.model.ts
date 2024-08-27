import { validateEmail } from "./../../lib/utils/index";
import {  parsePhoneWithCountry } from "./../../lib/utils/phone.handler";
import { IWalletModel } from "../wallet/wallet.schema";
import { EMessageStatus } from "./../messages/message.interface";
import {  otpGenerator } from "../../lib/helpers";
import { User } from "./user.schema";
import { IUser, ITokenData, IDataStoredInToken, IPlanRef, IUserNotificationSettings, IUserProfile } from "./user.interface";
import { IUserModel } from "./user.schema";
import socialAuth from "./../../lib/middleware/socialAuth";
import * as  bcrypt from "bcryptjs";
import { sendMessage } from "../../lib/services/otp-handler";
import jwt from "jsonwebtoken";
import { ObjectID } from "bson";
import { commonConfig } from "../../config";
import { HTTP400Error, HTTP401Error } from "../../lib/utils/httpErrors";
import walletModel from "../wallet/wallet.model";
import logger from "../../core/logger";
import { EPLANS, EPlanStatus } from "../plans/plans.interface";
import { CountryCode } from "libphonenumber-js";
import notifyService from "../../lib/services/notify.service";
import * as emailService from "../../lib/services/email.service";

const logFileName = "[UserModal] : ";
export class UserModel {
  public async fetchAll() {

    const data = User.find();

    return data;
  }

  private async findUserById(userId: string) {
    const user = await User.findById(userId);
    return user;
  }

  public async fetchUserMetrics() {
    const totalUsers = await User.countDocuments();
    return { totalUsers };
  }

  public async fetch(id: string) {
    const data = await User.aggregate([
      { $match: { _id: new ObjectID(id) } },
      {
        $lookup: {
          from: "wallets",
          localField: "walletId",
          foreignField: "_id",
          as: "wallet"
        },

      }
      , {
        $unwind: {
          path: "$wallet"
        }
      }
    ]);
    return data[0];
  }

  public async update(id: string, body: IUserModel) {
    const data = await User.findByIdAndUpdate(id, body, {
      runValidators: true,
      new: true
    });

    return data;
  }

  public async fetchUserDetailedActivePlan(userId: string){
    const userPlan = await User.aggregate([
      {$match:{_id:new ObjectID(userId)}},
      {
        $project:{
          activePlan: { $arrayElemAt: [ "$activePlans", 0 ] } 
        }
      },
      {
        $lookup: {
          from: "userplans",
          localField: "activePlan.planRef",
          foreignField: "_id",
          as: "activePlanInfo"
      },
     
      },
     
      {
        $project:{
          activePlanInfo: { $arrayElemAt: [ "$activePlanInfo", 0 ] } 
        }
      },
      {
        $lookup: {
          from: "plans",
          localField: "activePlanInfo.planId",
          foreignField: "planId",
          as: "planInfo"
      },
      },
     {
       $project:{
        planInfo: { $arrayElemAt: [ "$planInfo", 0 ] } ,
        activePlanInfo: 1
       }
     },
     
    
    ]);  
    if(userPlan[0] && userPlan[0].activePlanInfo){
      return userPlan[0];
    }
     throw new HTTP401Error("NO_ACTIVE_PLAN","You don't have any active plan to show");
  }
  public async fetchUserActivePlan(userId: string) {
    const userPlan = await User.aggregate([
      { $match: { _id: new ObjectID(userId) } },
      {$project:{
        _id:1,
        activePlans:1
      }},
      {
        $unwind: {
          path: "$activePlans"
        }
      },

      {
        $lookup: {
          from: "userplans",
          let: { planRef: "$activePlans.planRef" },
          pipeline: [
            {
              $match: {
                planStatus:{$in:[ EPlanStatus.ACTIVE,EPlanStatus.EXHAUSTED]},
                $expr: {
                  $eq: ["$_id", "$$planRef"],
                }
              }
            }
          ],
          as: "activePlan"
        },

      },
      
    ]);
    return userPlan[0]?.activePlan[0] || null;
  }
  

  public async addPlanToUser(userId: string, activePlanName: string, activePlanId: string) {
    const planRef: IPlanRef = { planName: activePlanName, planRef: activePlanId };
    const result = await User.findByIdAndUpdate(userId, { $push:{activePlans: planRef} });
    notifyService.planActivated(userId, activePlanId);
  }




  public async removeUserActivePlan(userId: string,planRef: string) {
    logger.info(logFileName, `removeUserActivePlan : ${userId} PlanRef: ${planRef}`);
    const userData = await User.findByIdAndUpdate(userId, { $pull: { activePlans: {planRef:new ObjectID(planRef)} } },{new:false}).lean();
    const activePlan = userData.activePlans.find(plan => plan.planRef.toString() === planRef);
    await User.findByIdAndUpdate(userId, { $push: {previousPlans:activePlan } });
  }

  public async checkIfUserCanActivatePlan(userId: string, planId: string) {
    if(planId==EPLANS.PAYG){
      return true;
    }
    const userActivePlan = await this.fetchUserActivePlan(userId);
    if(userActivePlan && userActivePlan.planStatus === EPlanStatus.ACTIVE){
        throw new HTTP400Error("ALREADY_HAS_ACTIVE_PLAN","User already has an active plan");
    }else if(userActivePlan && userActivePlan.planStatus === EPlanStatus.EXHAUSTED){
        await this.removeUserActivePlan(userId,userActivePlan._id);
    }   
  }
 

  public async delete(id: string) {
    await User.deleteOne({ _id: id });
  }

  async add(body: any) {
    // console.log('User Info While Adding new User', body);
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 12);
    }
    const q: IUserModel = new User(body);
    const data: IUserModel = await q.addNewUser();
    return { _id: data._id };
  }

  async createNewUser(phone: string,email: string,userName: string,country: CountryCode) {
    let walletId=null;
    try {
      const body: IUser = {phone,email,userName,country,emailVerified:false,isVerified:false,deactivation:false,role:"user",};
      const existingUser = await this.isUserExistByPhone(body.phone);
      let data: IUserModel;
      if (!existingUser) {
        const wallet: IWalletModel = await walletModel.createWallet(parseInt(process.env.INITIAL_WALLET_BALANCE));
        body.walletId = wallet._id;
        walletId = wallet._id;
        const newUser: IUserModel = new User(body);
        data = await newUser.addNewUser();
        if (!data) throw new HTTP400Error("SOME_ERROR_OCCURED");
        await walletModel.addUserToWallet(data.walletId, data._id);
        return data;
      }
      return existingUser;
    } catch (err) {
      walletModel.deleteWallet(walletId);
      throw new HTTP400Error(err.message);
    }
  }

  async registerWithPhone(phone: string,email: string,userName: string,country: CountryCode) {
    try {
      if(!phone || !email || !userName || !country) throw new HTTP400Error("Fields missing or empty { phone,email,userName,country} are required fields");
      if(!validateEmail(email)) throw new HTTP400Error("INVALID_EMAIL","Please enter valid email id");
      const phoneInfo = parsePhoneWithCountry(phone,country);
      logger.info("Phone Info is ",phoneInfo);
      const userExist = await this.findUserByPhone(phoneInfo.number);;
      if (userExist && userExist.isVerified) throw new HTTP401Error("USER_ALREADY_EXIST");

      if(userExist && !userExist.isVerified){
        const otp = this.updateOtp(userExist._id);
        const otpData = await this.sendOtpToMobile(otp, phoneInfo.number);
        if (otpData.proceed) {
          return { phone:phoneInfo.number, _id: userExist.id };
        }
      }else{
        const user: IUserModel = await this.createNewUser(phoneInfo.number,email,userName,country);
        const otp = this.updateOtp(user._id);
        const otpData = await this.sendOtpToMobile(otp, phone);
        if (otpData.proceed) {
          return { phone:phoneInfo.number, _id: user.id };
        }
      }
     
      throw new HTTP400Error("OTP_NOT_SENT");
    } catch (e) {
      logger.error(logFileName, e);
      if (e.code == 11000) {
        throw new HTTP400Error(e.keyPattern.email ? "EMAIL_ALREADY_REGISTERED" : "PHONE_ALREADY_REGISTERED");
      }
      throw new HTTP400Error(e.message);
    }
  }

  public async loginWithPhone(phone: string,country: CountryCode) {
    const parsedPhone = parsePhoneWithCountry(phone,country).number;
    const user: IUserModel = await this.findUserByPhone(parsedPhone);
    if (!user) throw new HTTP401Error("USER_NOT_FOUND");
    const otp = this.updateOtp(user._id);
    const otpData = await this.sendOtpToMobile(otp, parsedPhone);
    // if (otpData.proceed)  throw new HTTP401Error("ERROR_IN_SENDING_OTP");
    return { phone: parsedPhone, _id: user.id };
  }

  public async resendOTP(id: string, body: any) {
    const parsedPhone = parsePhoneWithCountry(body.phoneNumber,body.country);
    const user: IUserModel = await User.findOne({ _id: new ObjectID(id), phone: parsedPhone });
    if (!user) throw new HTTP401Error("USER_NOT_FOUND");
    const otp = this.updateOtp(user._id);
    const otpData = await this.sendOtpToMobile(otp, body.phone);
    // if (otpData.proceed) {
    // }
    return { phone: body.phone, _id: user.id };
  }

  private async findUserByPhone(phone: string) {
    return await User.findOne({ phone });
  }

  public async signUp(body: IUserModel) {
    try {
      await this.isUserExist(body);
      body.role = "user";
      const data = await this.add(body);

      const userData = await this.addNewToken(data._id);

      return userData;

    } catch (e) {
      throw new HTTP400Error(e.message);
    }

  };

  public async isUserExist(body: any) {
    try {
      const { userName, password } = body;

      // 1>  check email and password exist
      if (!userName || !password) {
        throw new HTTP400Error("Please provide userName or password");
      }
      // 2> check if user exist and password is correct
      const user = await User.findOne({ userName: userName }).select("+password");

      if (user) {
        throw new HTTP400Error("Invalid userName or password");
      }
    } catch (e) {
      throw new HTTP400Error(e.message);
    }
  }

  public async login(body: any) {
    try {
      const { userName, password } = body;

      // 1>  check email and password exist
      if (!userName || !password) {
        throw new HTTP400Error("Please provide userName or password");
      }
      // 2> check if user exist and password is correct
      const user = await User.findOne({ userName: userName }).select("+password");

      if (!user || !(await user.correctPassword(password, user.password))) {
        throw new HTTP400Error("Invalid email or password");
      }
      // 3> if eveything is ohkay send the token back
      const userData = await this.addNewToken(user._id);

      return userData;
    } catch (e) {
      throw new HTTP400Error(e.message);
    }
  };

  public async verifyUser(otp: string, userId: string) {
    // console.log("verify user ", userId, otp);
    return { proceed: true };

  }
  public async isUserExistByPhone(phone: string) {
    const user: IUserModel = await User.findOne({ phone: phone }).lean();
    return user;
  }

  public async authenticateWithAccesToken(data: any) {
    try {
      //, { appleSub: data.id }
      console.log(data);
      const userInfo = await User.findOne({ $or: [{ $and: [{ email: { $ne: null } }, { email: { $eq: data.email } }] }, { $and: [{ facebookId: { $ne: null } }, { facebookId: { $eq: data.id } }] }] });
      console.log("User At Social Auth :", userInfo);
      if (userInfo) {
        console.log(userInfo);
        console.log(userInfo, "User info here");
        // let token = await this.addNewToken(userInfo._id, userInfo);
        return { userInfo, isExisted: true };
      }
      else {
        return { data, isExisted: false };
      }
    } catch (e) {
      throw new HTTP400Error(e);
    }
  }


  public async loginViaSocialAccessToken(body: any) {
    try {
      let user;
      if (body.authProvider === "google") {
        user = await socialAuth.getGoogleUserInfo(body.access_token);
      } else if (body.authProvider === "facebook") {
        user = await socialAuth.getFacebookUserInfo(body.access_token);
      } else if (body.authProvider === "apple") {
        // user = await socialAuth.verifyAppleUserInfo(body);
      }
      console.log("Login Info as Fetched By Auth Provider : ", user);
      const response = await this.authenticateWithAccesToken(user);

      if (!response.isExisted) {
        let u;
        const userName = await this.generateValiduserName(user.given_name);
        if (body.authProvider === "facebook") {
          u = {
            role: "user",
            firstName: `${user.given_name}`,
            userName: userName,
            lastName: `${user.family_name}`,
            phone: body.phone,
            facebookId: user.id
          };
        } else if (body.authProvider === "google") {
          console.log(user);
          u = {
            role: "user",
            firstName: `${user.given_name}`,
            userName: userName,
            lastName: `${user.family_name}`,
            phone: body.phone,
            email: user.email,
          };
        }

        const data = await this.add(u);
        const userData = await this.addNewToken(data._id);
        return userData;
      } else {
        const userData = await this.addNewToken(response.userInfo._id);
        return userData;
      }
    } catch (e) {
      throw new HTTP400Error(e.message);
    }
  }



  updateOtp(id: string): number {
    const otp = otpGenerator();
    User.findByIdAndUpdate(id, { otp }).then();
    return otp;
  }

  public async updateDeviceCode(userId: string, phone: string) {
    const code = otpGenerator();
    const key = `deviceCodes.${phone}`;
    const data = await User.findByIdAndUpdate(userId, { [key]: code });
    return code;
  }

  public async validateDeviceCode(userId: string, devicePhone: string, code: number) {
    const key = `deviceCodes.${devicePhone}`;
    const data = await User.findOne({ "_id": new ObjectID(userId), [key]: code });
    if (!data) throw new HTTP400Error("INVALID_CODE", "The code you have entered is invalid");
  }
  async sendOtpToMobile(otp: number, phone: string) {
    logger.debug(logFileName, `send this ${otp} to ${phone}`);
    const message = `Your WhatsSpot login OTP is ${otp}.`;
    return await sendMessage(phone, message);
  }





  public signToken = (dataToStore: IDataStoredInToken) => {
    return jwt.sign(dataToStore, commonConfig.jwtSecretKey, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  };


  public async addNewToken(dataToStore: IDataStoredInToken) {
    const token = this.signToken(dataToStore);

    const data = {
      token,
      expiresIn: process.env.JWT_EXPIRES_IN
    };

    return data;
  }


  async fetchOnOtp(id: string, otp: number) {
    return await User.findOne({ _id: id, otp });
  }

  async verifyOtp(id: string, otp: number) {
    try {
      if (!otp) {
        throw new HTTP400Error("OTP not entered");
      }
      const otpData = await this.fetchOnOtp(id, otp);

      if (otp == Number(process.env.STATIC_OTP)) {

      }
      else if (!otpData) {
        throw new HTTP400Error("WRONG_OTP");
      }
      this.updateOtp(id);
      const wallet = await walletModel.fetchWalletByUserId(id);
      const data = await User.findOneAndUpdate({ _id: new ObjectID(id) }, { $set: { isVerified: true, walletId: wallet._id, } }, { new: true });
      const dataToStore: IDataStoredInToken = { id, walletId: wallet._id };
      const tokenData = await this.addNewToken(dataToStore);
      const cookie = this.createCookie(tokenData);

      return { tokenData, data, cookie };
    } catch (e) {
      console.log(e.message);
      throw new HTTP400Error(e.message);
    }
  }

  public createCookie(tokenData: ITokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
  private async generateValiduserName(firstName: string, id: string | null = null) {
    let s = this.randomString(6);
    let userName = `${firstName}_${s}`;
    if (id == null) {
      while ((await User.findOne({ "userName": userName }).count()) > 0) {
        s = this.randomString(6);
        userName = `${firstName}_${s}`;
      }
    } else {
      while ((await User.findOne({ _id: { $ne: id }, "userName": userName }).count()) > 0) {
        s = this.randomString(6);
        userName = `${firstName}_${s}`;
      }
    }
    return userName;
  }

  private randomString(length: number) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
  }

  public async addPhone(body: any) {
    try {
      let user;
      if (body.authProvider === "google") {
        user = await socialAuth.getGoogleUserInfo(body.access_token);
      } else if (body.authProvider === "facebook") {
        user = await socialAuth.getFacebookUserInfo(body.access_token);
      }
      console.log("User At Addding Phone In Social Auth:", user);
      if (user) {
        const temp = await User.findOne({ $or: [{ $and: [{ email: { $ne: null } }, { email: { $eq: user.email } }] }, { $and: [{ facebookId: { $ne: null } }, { facebookId: { $eq: user.id } }] }] }); //If User exist but starting facebook auth
        const updatePhone = await User.findOne({ $or: [{ facebookId: user.id }, { appleSub: user.id }] }); // If user added facebookId but while adding phone number entred worng number and an OTP is sent
        if (temp) {
          // if (body.authProvider === 'facebook') {
          //   await User.updateOne({ phone: body.phone }, { $set: { facebookId: user.id } });
          // } 
          // let otpData;
          // if (body.phone === '9876543219') {
          //   otpData = { proceed: true };
          // } else {
          //   const otp = this.updateOtp(temp._id);
          //   console.log(otp);
          //   otpData = await this.sendOtpToMobile(otp, body.phone);
          //   console.log(otpData);
          // }
          // TODO: Uncomment
          const token = this.addNewToken(temp._id);
          if (temp) {
            return { _id: temp._id, isExisted: true, token };
          } else {
            throw new HTTP400Error("Unable to Send OTP");
          }
        } else if (updatePhone) {
          const data = await User.findOneAndUpdate({ $or: [{ facebookId: user.id }, { appleSub: user.id }] }, { $set: { phone: body.phone } });
          if (data) {
            const otp = this.updateOtp(data._id);
            console.log(otp);
            const otpData = await this.sendOtpToMobile(otp, body.phone);
            console.log(otpData);
            if (otpData.proceed) {
              return { _id: data._id, isExisted: false };
            } else {
              throw new HTTP400Error("Unable to Send OTP");
            }
          } else {
            throw new HTTP400Error("Error in Facebook User for Updatiing Phone");
          }
        } else { // If we are adding a completely new user
          let u;
          const userName = await this.generateValiduserName(user.given_name);
          if (body.authProvider === "facebook") {
            u = {
              role: "user",
              firstName: `${user.given_name}`,
              userName: userName,
              lastName: `${user.family_name}`,
              phone: body.phone,
              facebookId: user.id
            };
          } else if (body.authProvider === "google") {
            console.log(user);
            u = {
              role: "user",
              firstName: `${user.given_name}`,
              userName: userName,
              lastName: `${user.family_name}`,
              phone: body.phone,
              email: user.email,
            };
          }

          const data = await this.add(u);
          const otp = this.updateOtp(data._id);
          console.log(otp);
          const otpData = await this.sendOtpToMobile(otp, body.phone);
          console.log(otpData);
          if (otpData.proceed) {
            return { _id: data._id, isExisted: false };
          } else {
            throw new HTTP400Error("Unable to Send OTP");
          }
        }
      } else {
        throw new HTTP400Error("Not Authorised to edit phone number");
      }
    } catch (e) {
      console.log(e);
      throw new HTTP400Error(e);
    }
  }

  public async genrateOTP(phone: string) {
    const otp = otpGenerator();

    const res = await this.sendOtpToMobile(otp, phone,);


    if (res.proceed) {
      return { res, proceed: true };
    }

    return { proceed: false };
  };

  public async addPhoneNumber(id: string, phone: string) {
    try {
      console.log(id);
      const user = await User.findById(id);
      console.log(user);

      if (!user) {
        throw new HTTP400Error("User does not exist");
      }

      if (user.phone == null) {
        await User.findOneAndUpdate({ _id: id }, {
          $set: { phone: phone }
        });
      }

      const otp = await this.updateOtp(id);

      const otpData = await this.sendOtpToMobile(otp, phone);
      console.log(otpData);
      if (otpData.proceed) {
        return { _id: user._id, isExisted: true };
      } else {
        throw new HTTP400Error("Unable to Send OTP");
      }
    } catch (e) {
      throw new HTTP400Error(e.message);
    }

  }

  public async isUserVerified(id: string) {
    const user = await User.findById(id);

    if (user.isVerified) {
      return { proceed: true, phone: user.phone };
    }

    return { proceed: false };
  };
  public async getAccountMetrics(userId: string) {
    console.log("user id is ", userId);

    const result = await User.aggregate([
      { $match: { _id: new ObjectID(userId) } },
      { $set: { _id: { $toObjectId: "$_id" } } },
      {
        $project: {
          _id: 1
        }
      },
      {
        $lookup: {
          from: "devices",
          // localField: "_id",
          // foreignField: "userId",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                "isDeleted.status": false,
                $expr: {
                  $eq: ["$userId", "$$userId"],
                }
              }
            }
          ],
          as: "devices"
        },

      },
      {
        $unwind: {
          path: "$devices"
        }
      },
      {
        $project: {
          deviceId: "$devices._id",
          authState: "$devices.authState"
        }
      },
      { $set: { deviceId: { $toString: "$deviceId" } } },
      {
        $lookup: {
          from: "fastmessages",
          localField: "deviceId",
          foreignField: "deviceId",
          as: "fastMessages"
        },
      },
      {
        $lookup: {
          from: "messagequeues",
          localField: "deviceId",
          foreignField: "deviceId",
          as: "queueMessages"
        },

      },
      {
        $project: {

          deviceId: "$deviceId",
          authState: "$authState",
          metrics: {
            totalFastError: {
              $size: {
                $filter: {
                  input: "$fastMessages",
                  as: "fastMessage",
                  cond: { "$eq": ["$$fastMessage.status", EMessageStatus.ERROR] }
                }
              }
            },
            totalFastSuccess: {
              $size: {
                $filter: {
                  input: "$fastMessages",
                  as: "fastMessage",
                  cond: { "$eq": ["$$fastMessage.status", EMessageStatus.SENT] }
                }
              }
            },
            totalQueueSuccess: {
              $size: {
                $filter: {
                  input: "$queueMessages",
                  as: "queueMessage",
                  cond: { "$eq": ["$$queueMessage.status", EMessageStatus.SENT] }
                }
              }
            },
            totalQueueError: {
              $size: {
                $filter: {
                  input: "$queueMessages",
                  as: "queueMessage",
                  cond: { "$eq": ["$$queueMessage.status", EMessageStatus.ERROR] }
                }
              }
            },
            totalQueuePending: {
              $size: {
                $filter: {
                  input: "$queueMessages",
                  as: "queueMessage",
                  cond: { "$eq": ["$$queueMessage.status", EMessageStatus.PENDING] }
                }
              }
            }
          }
        }
      },

      {
        $group: {
          _id: "$_id",
          totalDevices: { $sum: 1 },
          activeDevices: {
            "$sum": {
              "$cond": [
                { "$eq": ["$authState", true] },
                1,
                0
              ]
            }
          },
          totalFastSuccess: { $sum: "$metrics.totalFastSuccess" },
          totalFastError: { $sum: "$metrics.totalFastError" },
          totalQueueSuccess: { $sum: "$metrics.totalQueueSuccess" },
          totalQueueError: { $sum: "$metrics.totalQueueError" }

        }
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          metrics: {
            activeDevices: "$activeDevices",
            totalDevices: "$totalDevices",
            totalFastSuccess: "$totalFastSuccess",
            totalFastError: "$totalFastError",
            totalQueueSuccess: "$totalQueueSuccess",
            totalQueueError: "$totalQueueError"
          }
        }
      }
    ]);
    return result[0] || null;
  }

  public async fetchUsersBaseList() {
    return await User.aggregate([
      { $match: {} },
      {
        $lookup: {
          from: "devices",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$userId", "$$userId"],
                }
              }
            }
          ],
          as: "totalDevices"
        },
      },
      {
        $lookup: {
          from: "userplans",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$userId", "$$userId"],
                }
              }
            }
          ],
          as: "plans"
        },
      },
    
      {
        $lookup: {
          from: "devices",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                "isDeleted.status": true,
                $expr: {
                  $eq: ["$userId", "$$userId"],
                }
              }
            }
          ],
          as: "deletedDevices"
        },
      },
      {
        $lookup: {
          from: "devices",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                authState: true,
                $expr: {
                  $eq: ["$userId", "$$userId"],
                }
              }
            }
          ],
          as: "activeDevices"
        },
      },
      {
        $lookup: {
          from: "devices",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                authState: false,
                $expr: {
                  $eq: ["$userId", "$$userId"],
                }
              }
            }
          ],
          as: "inactiveDevices"
        },
      },
      {
        $lookup: {
          from: "wallets",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$userId", "$$userId"],
                }
              }
            },
            {
              $project:{
                balance:1,
              }
            }
          ],
          as: "wallet"
        },
      },
      { $addFields: {totalDevices: { $size: "$totalDevices", }  },},
      { $addFields: {deletedDevices: { $size: "$deletedDevices", }  }},
      { $addFields: {activeDevices: { $size: "$activeDevices", }  }},
      { $addFields: {inactiveDevices: { $size: "$inactiveDevices", }  }},
      { $addFields: {wallet:{ $arrayElemAt: [ "$wallet", 0 ] } }},
      {
        $project:{
          phone:1,
          email:1,
          totalDevices:1,
          deletedDevices:1,
          activeDevices:1,
          inactiveDevices:1,
          createdAt:1,
          isVerified:1,
          deactivation:1,
          walletId:1,
          walletBalance:"$wallet.balance",
          hasActivePlan: {
            $size: {
              $filter: {
                input: "$plans",
                as: "plans",
                cond: { "$eq": ["$$plans.planStatus", EPlanStatus.ACTIVE] }
              }
            }
          },
        }
      }
    ]);
  };

  public async userDetailedAccountMetrics(userId: string) {
    return await User.aggregate([
     
      { $match: { _id: new ObjectID(userId) } },
      { $set: { _id: { $toObjectId: "$_id" } } },
     
      {
        $lookup: {
          from: "devices",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                // "isDeleted.status": false,
                $expr: {
                  $eq: ["$userId", "$$userId"],
                }
              }
            },
            {
              $project: {
                apiKeys:0,
                
              }
            }
          ],
          as: "devices"
        },

      },
      {
        $lookup: {
          from: "userplans",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$userId", "$$userId"],
                }
              }
            }
          ],
          as: "plans"
        },

      },
      {
        $lookup: {
          from: "wallets",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$userId", "$$userId"],
                }
              },
              
            },
            {
              $project:{
                _id:0,
                walletId:"$_id",
                balance:1,
                createdAt:1,
                updatedAt:1,
              }
            }
          ],
          as: "wallet"
        },

      },
      {
        $project:{
          _id:0,
          userInfo:{
            userId:"$_id",
            isVerified:"$isVerified",
            deactivation:"$deactivation",
            phone:"$phone",
            email:"$email",
            waletId:"$walletId",
            previousPlans:"$previousPlans",
            createdAt:"$createdAt",
            updatedAt:"$updatedAt",
          },
          walletInfo: { $arrayElemAt: [ "$wallet", 0 ] },
          devices:1,
          plans:1
        }
      }
     
    ]);
  }

public async updateNotificationSettings(userId: string, notificationSetting: IUserNotificationSettings) {
    const newSettings = { 
      device:{
        ...notificationSetting.device,
      },
      plan:{
        ...notificationSetting.plan,
      }
    };
  return await User.findOneAndUpdate({_id:new ObjectID(userId)},{$set:{"settings.notifications":newSettings}},{new:true}).select("settings.notifications").lean();
}

public async updateProfile(userId: string,profileBody: IUserProfile){
  if(!profileBody.country || !profileBody.userName) throw new HTTP400Error("Invalid request","country and userName are required");
  return await User.findByIdAndUpdate(userId,{country:profileBody.country,userName:profileBody.userName},{new:true}).lean();
}

public async sendEmailVerification(userId: string){
    const user: IUserModel = await this.findUserById(userId);
    if(user.emailVerified) throw new HTTP401Error("EMAIL_ALREADY_VERIFIED","Your email id is already verifeid");
    if(!user) throw new HTTP400Error("USER_NOT_FOUND","User not found");
    const email = user.email;
    if(!email) throw new HTTP400Error("USER_EMAIL_FOUND","User do not have email");
    const otp = otpGenerator();
    logger.info(logFileName,`Sending Email OTP ${otp} to ${email}`);
    await User.findByIdAndUpdate(userId,{$set:{emailOtp:otp}});
    const res = await emailService.sendVerificationMail(email,"Email Verification",`Dear ${user.userName}, Your OTP for email verification is <b><h2>${otp}</h2></h2></b>`,`Dear ${user.userName}, Your OTP for email verification is <b><h2>${otp}</h2></h2></b>`);
    if(!res) throw new HTTP400Error("EMAIL_SEND_FAILED","Email send failed");
}

public async verifyEmaliOtp(userId: string,otp: string){
  const user: IUserModel = await this.findUserById(userId);
  if(!user) throw new HTTP400Error("USER_NOT_FOUND","User not found");
  if(user.emailVerified) throw new HTTP400Error("EMAIL_ALREADY_VERIFIED","Your email id is already verifeid");
  if(!user.emailOtp) throw new HTTP400Error("EMAIL_OTP_NOT_FOUND","Email OTP not found");
  if(user.emailOtp !== parseInt(otp)) throw new HTTP400Error("INVALID_OTP","The entered OTP is invalid");
  return await User.findByIdAndUpdate(userId,{$set:{emailVerified:true}}).lean();
}

public getUserById(userId: string){
  return User.findById(userId);
}


}

export default new UserModel();