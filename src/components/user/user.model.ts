import { sanatizeMobile } from './../../lib/utils/index';
import { IWallet } from './../walllet/wallet.interface';
import { IWalletModel } from './../walllet/wallet.schema';
import { EMessageStatus } from './../messages/message.interface';
import { generateToken, imageUrl, isValidMongoId, otpGenerator } from "../../lib/helpers";
import { User, UserSchema } from "./user.schema";
import { IUser, ITokenData, IDataStoredInToken } from './user.interface';
import { IUserModel } from "./user.schema";
import socialAuth from "./../../lib/middleware/socialAuth";
import bcrypt from 'bcrypt';
import axios from 'axios';
import { sendMessage } from "../../lib/services/otp";
import jwt from 'jsonwebtoken';
import { ObjectID } from "bson";
import { commonConfig } from "../../config";
import { HTTP400Error, HTTP401Error } from "../../lib/utils/httpErrors";
import walletModel, { WalletModel } from '../walllet/wallet.model';

export class UserModel {
  public async fetchAll() {

    const data = User.find();

    return data;
  }
  
  private async findUserById(userId:string){
    const user = await User.findById(userId);
    return user;
  }

 public async fetch(id: string) {
    const data = User.findById(id);
    return data;
  }

  public async update(id: string, body: IUserModel) {
    const data = await User.findByIdAndUpdate(id, body, {
      runValidators: true,
      new: true
    })

    return data;
  }

  public async delete(id: string) {
    await User.deleteOne({ _id: id });
  }

  async add(body: any) {
    console.log('User Info While Adding new User', body);
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 12);
    }
    const q: IUserModel = new User(body);
    const data: IUserModel = await q.addNewUser();
    return { _id: data._id };
  }

  async createNewUser(body:IUser){
try{
  body.role="user";
  const existingUser = await this.isUserExistByPhone(body.phone);
  let data: IUserModel;
  if (!existingUser) {
    const wallet:IWalletModel = await walletModel.createWallet();
    body.walletId = wallet._id;
    const newUser: IUserModel = new User(body);
    data = await newUser.addNewUser();
    if (!data) throw new HTTP400Error("SOME_ERROR_OCCURED");
    await walletModel.addUserToWallet(data.walletId,data._id);
    return data;
  }
  return existingUser;
}catch(err){
  throw new HTTP400Error(err.message)
}
  }

  async registerWithPhone(body: IUser) {
    console.log("register with phone ", body);
    try {
      const userExist = await this.findUserByPhone(body.phone);;
      if(userExist) throw new HTTP401Error("USER_ALREADY_EXIST");
     const user:IUserModel = await this.createNewUser(body);
      const otp = this.updateOtp(user._id);
      const otpData = await this.sendOtpToMobile(otp, body.phone);
      if (otpData.proceed) {
        return { phone: body.phone, _id: user.id};
      }
      throw new HTTP400Error("OTP_NOT_SENT");
    } catch (e) {
      console.log(e);
      if (e.code == 11000) {
        throw new HTTP400Error(e.keyPattern.email ? "EMAIL_ALREADY_REGISTERED" : "PHONE_ALREADY_REGISTERED");
      }
      throw new HTTP400Error(e.message);
    }
  }

  public async loginWithPhone(body:IUser){
    const user:IUserModel = await this.findUserByPhone(body.phone);
    if(!user) throw new HTTP401Error("USER_NOT_FOUND");
    const otp = this.updateOtp(user._id);
    const otpData = await this.sendOtpToMobile(otp, body.phone);
    if (otpData.proceed) {
      return { phone: body.phone, _id: user.id};
    }
  }

  public async resendOTP(id:string,body:any){
    const user:IUserModel = await User.findOne({_id:new ObjectID(id),phone:sanatizeMobile(body.phoneNumber)});
    if(!user) throw new HTTP401Error("USER_NOT_FOUND");
    const otp = this.updateOtp(user._id);
    const otpData = await this.sendOtpToMobile(otp, body.phone);
    if (otpData.proceed) {
      return { phone: body.phone, _id: user.id};
    }
  }

  private async findUserByPhone(phone:string){
    return await User.findOne({phone});
  }

  public async signUp(body: IUserModel) {
    try {
      await this.isUserExist(body);
      body.role = 'user';
      let data = await this.add(body);
    
      const userData = await this.addNewToken(data._id);

      return userData;

    } catch (e) {
      throw new HTTP400Error(e.message);
    }

  };

  public async isUserExist(body: any) {
    try {
      const { username, password } = body;

      // 1>  check email and password exist
      if (!username || !password) {
        throw new HTTP400Error('Please provide username or password');
      }
      // 2> check if user exist and password is correct
      const user = await User.findOne({ username: username }).select('+password');

      if (user) {
        throw new HTTP400Error('Invalid username or password');
      }
    } catch (e) {
      throw new HTTP400Error(e.message);
    }
  }

  public async login(body: any) {
    try {
      const { username, password } = body;

      // 1>  check email and password exist
      if (!username || !password) {
        throw new HTTP400Error('Please provide username or password');
      }
      // 2> check if user exist and password is correct
      const user = await User.findOne({ username: username }).select('+password');

      if (!user || !(await user.correctPassword(password, user.password))) {
        throw new HTTP400Error('Invalid email or password');
      }
      // 3> if eveything is ohkay send the token back
      const userData = await this.addNewToken(user._id);

      return userData;
    } catch (e) {
      throw new HTTP400Error(e.message);
    }
  };

  public async verifyUser(otp: string, userId: string) {
    console.log("verify user ", userId, otp);
    return { proceed: true }

  }
  public async isUserExistByPhone(phone: string) {
    const user: IUserModel = await User.findOne({ phone: phone }).lean();
    return user;
  }

  public async authenticateWithAccesToken(data: any) {
    try {
      //, { appleSub: data.id }
      console.log(data);
      let userInfo = await User.findOne({ $or: [{ $and: [{ email: { $ne: null } }, { email: { $eq: data.email } }] }, { $and: [{ facebookId: { $ne: null } }, { facebookId: { $eq: data.id } }] }] });
      console.log('User At Social Auth :', userInfo);
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
      if (body.authProvider === 'google') {
        user = await socialAuth.getGoogleUserInfo(body.access_token);
      } else if (body.authProvider === 'facebook') {
        user = await socialAuth.getFacebookUserInfo(body.access_token);
      } else if (body.authProvider === 'apple') {
        // user = await socialAuth.verifyAppleUserInfo(body);
      }
      console.log('Login Info as Fetched By Auth Provider : ', user)
      let response = await this.authenticateWithAccesToken(user);

      if (!response.isExisted) {
        let u;
        let userName = await this.generateValidUsername(user.given_name);
        if (body.authProvider === 'facebook') {
          u = {
            role: 'user',
            firstName: `${user.given_name}`,
            username: userName,
            lastName: `${user.family_name}`,
            phone: body.phone,
            facebookId: user.id
          }
        } else if (body.authProvider === 'google') {
          console.log(user);
          u = {
            role: 'user',
            firstName: `${user.given_name}`,
            username: userName,
            lastName: `${user.family_name}`,
            phone: body.phone,
            email: user.email,
          }
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

  public async addFollower(id: string, userId: string) {

    const data = User.findOneAndUpdate({ id: userId }, {
      $push: { "followers": id }
    })

    return data;
  };





  public async addFollowing(id: string, userId: string) {
    const data = User.findOneAndUpdate({ _id: userId }, {
      $push: { "following": id }
    })

    return data;
  };


  public async addFollowRequest(id: string, userId: string) {
    const data = User.findOneAndUpdate({ id: userId }, {
      $push: { "followRequest": id }
    })

    return data;
  };

  public async acceptFollowRequest(id: string, userId: string) {
    const data = await User.findOneAndUpdate({ id: userId }, {
      $pull: { "followRequest": id }
    });

    if (data) {
      await User.findOneAndUpdate({ id: userId }, {
        $push: { "followRequest": id }
      })

      await User.findOneAndUpdate({ id }, {
        $push: { "following": userId }
      });
    }

    return data;
  };

  updateOtp(id: string): number {
    console.log("New OTP");
    const otp = otpGenerator();
    User.findByIdAndUpdate(id, { otp }).then();
    return otp;
  }

  async sendOtpToMobile(otp: number, phone: string) {
    console.log(`send this ${otp} to ${phone}`);
    const message = `Your SpotDoit Services login OTP is ${otp}.`;
    return await sendMessage(phone, message);
  }



  // private async generateValidUsername(firstName: string, id: string | null = null) {
  //   let s = this.randomString(6);
  //   let userName = `${firstName}_${s}`
  //   if (id == null) {
  //     while ((await User.findOne({ "userName": userName }).count()) > 0) {
  //       s = this.randomString(6);
  //       userName = `${firstName}_${s}`
  //     }
  //   } else {
  //     while ((await User.findOne({ _id: { $ne: id }, "userName": userName }).count()) > 0) {
  //       s = this.randomString(6);
  //       userName = `${firstName}_${s}`
  //     }
  //   }
  //   return userName;
  // }

  public signToken = (dataToStore:IDataStoredInToken) => {
    return jwt.sign(dataToStore, commonConfig.jwtSecretKey, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  };


  public async addNewToken(dataToStore:IDataStoredInToken) {
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
      
      if(otp==Number(process.env.STATIC_OTP)){

      }
      else if (!otpData) {
        throw new HTTP400Error("WRONG_OTP");
      }
        this.updateOtp(id);
      const wallet = await walletModel.fetchWalletByUserId(id);
      const data = await User.findOneAndUpdate({ _id: new ObjectID(id) }, { $set: { isVerified: true,walletId:wallet._id, } }, { new: true });
      const dataToStore:IDataStoredInToken = {id,walletId:wallet._id};
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
  private async generateValidUsername(firstName: string, id: string | null = null) {
    let s = this.randomString(6);
    let userName = `${firstName}_${s}`
    if (id == null) {
      while ((await User.findOne({ "userName": userName }).count()) > 0) {
        s = this.randomString(6);
        userName = `${firstName}_${s}`
      }
    } else {
      while ((await User.findOne({ _id: { $ne: id }, "userName": userName }).count()) > 0) {
        s = this.randomString(6);
        userName = `${firstName}_${s}`
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
      if (body.authProvider === 'google') {
        user = await socialAuth.getGoogleUserInfo(body.access_token);
      } else if (body.authProvider === 'facebook') {
        user = await socialAuth.getFacebookUserInfo(body.access_token);
      }
      console.log('User At Addding Phone In Social Auth:', user);
      if (user) {
        let temp = await User.findOne({ $or: [{ $and: [{ email: { $ne: null } }, { email: { $eq: user.email } }] }, { $and: [{ facebookId: { $ne: null } }, { facebookId: { $eq: user.id } }] }] }); //If User exist but starting facebook auth
        let updatePhone = await User.findOne({ $or: [{ facebookId: user.id }, { appleSub: user.id }] }); // If user added facebookId but while adding phone number entred worng number and an OTP is sent
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
          let data = await User.findOneAndUpdate({ $or: [{ facebookId: user.id }, { appleSub: user.id }] }, { $set: { phone: body.phone } });
          if (data) {
            const otp = this.updateOtp(data._id);
            console.log(otp);
            let otpData;
            otpData = await this.sendOtpToMobile(otp, body.phone);
            console.log(otpData);
            if (otpData.proceed) {
              return { _id: data._id, isExisted: false };
            } else {
              throw new HTTP400Error("Unable to Send OTP");
            }
          } else {
            throw new HTTP400Error('Error in Facebook User for Updatiing Phone');
          }
        } else { // If we are adding a completely new user
          let u;
          let userName = await this.generateValidUsername(user.given_name);
          if (body.authProvider === 'facebook') {
            u = {
              role: 'user',
              firstName: `${user.given_name}`,
              username: userName,
              lastName: `${user.family_name}`,
              phone: body.phone,
              facebookId: user.id
            }
          } else if (body.authProvider === 'google') {
            console.log(user);
            u = {
              role: 'user',
              firstName: `${user.given_name}`,
              username: userName,
              lastName: `${user.family_name}`,
              phone: body.phone,
              email: user.email,
            }
          }

          let data = await this.add(u);
          const otp = this.updateOtp(data._id);
          console.log(otp);
          let otpData;
          otpData = await this.sendOtpToMobile(otp, body.phone);
          console.log(otpData);
          if (otpData.proceed) {
            return { _id: data._id, isExisted: false };
          } else {
            throw new HTTP400Error("Unable to Send OTP");
          }
        }
      } else {
        throw new HTTP400Error('Not Authorised to edit phone number');
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

      let otpData;
      otpData = await this.sendOtpToMobile(otp, phone);
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
  public async getAccountMetrics(userId:string){
    console.log("user id is ",userId);
    
    let result = await User.aggregate([
      { $match: {_id:new ObjectID(userId)} },
      { $set: { _id: { $toObjectId: "$_id" } } },
      {
          $project: {
              _id: 1
          }
      },
      {
        $lookup: {
            from: "devices",
            localField: "_id",
            foreignField: "userId",
            as: "devices"
        },

    },
    {
      $unwind: {
          path: '$devices'
              }
  },
  {$project:{
    deviceId:"$devices._id",
    authState:"$devices.authState"
  }},
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

            deviceId:"$deviceId",
            authState:"$authState",
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
          _id:"$_id",
             totalDevices : {$sum: 1},
             activeDevices:  {'$sum': {
              '$cond': [
                  { '$eq': ['$authState', true]},
                  1, 
                  0
              ]
          }},
            totalFastSuccess:{$sum :"$metrics.totalFastSuccess"},
            totalFastError:{$sum :"$metrics.totalFastError"},
            totalQueueSuccess:{$sum :"$metrics.totalQueueSuccess"},
            totalQueueError:{$sum :"$metrics.totalQueueError"}
          
    }},
    {
      $project:{ 
        _id:0,
        userId:"$_id",  
        metrics:{
          activeDevices:"$activeDevices",   
          totalDevices:"$totalDevices",
          totalFastSuccess:"$totalFastSuccess",
          totalFastError:"$totalFastError",
          totalQueueSuccess:"$totalQueueSuccess",
          totalQueueError:"$totalQueueError"
        } 
      }
    }
  ]);

  console.log("metrics result ",result);
  return result[0]||null;
  }
}

export default new UserModel();