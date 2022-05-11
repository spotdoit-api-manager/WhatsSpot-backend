import { commonConfig } from "./../../config/index";
import { HTTP400Error } from "./../../lib/utils/httpErrors";
import { sendMessage } from "../../lib/services/otp-handler";
import logger from "../../core/logger";
import { otpGenerator } from "../../lib/helpers";
import { HTTP401Error } from "../../lib/utils/httpErrors";
import { IAdminUser, IDataStoredInAdminToken } from "./admin.interface";
import { AdminUser, IAdminUserModel } from "./admin.schema";
import { ObjectID } from "bson";
import { ITokenData } from "../user/user.interface";
import jwt from "jsonwebtoken";
import deviceModel from "../device/device.model";
import userModel from "../user/user.model";
import walletModel from "../wallet/wallet.model";

const logFileName = "[AdminModel] : ";
export class AdminModel {

    public async fetch(id: string) {
       return await AdminUser.findById(id);
      }
    
    public async metrics(){
        const devicesMetrics = await deviceModel.fetchDevicesMetrics();
        const usersMetrics = await userModel.fetchUserMetrics();
        const walletBalance = await walletModel.getTotalWalletBalance();
        return {devicesMetrics, usersMetrics,walletBalance};
    }

    public async fetchUsersBaseList(){
        return await userModel.fetchUsersBaseList();
    }

    public async userDetailedAccountMetrics(userId: string){
        return await userModel.userDetailedAccountMetrics(userId);
    }

    public async addNewAdmin(body: IAdminUser) {
        body.isSuperAdmin = false;
        const newAdminUser = new AdminUser(body);
        return await newAdminUser.save();
    }
    private findAdminUserByPhone(phone: string) {
        return AdminUser.findOne({ phoneNumber: phone });
    }
    public async loginWithPhone(phoneNumber: string) {
        const adminUser: IAdminUserModel = await this.findAdminUserByPhone(phoneNumber);
        if (!adminUser) throw new HTTP401Error("ADMIN_USER_NOT_FOUND");
        const otp = this.updateOtp(adminUser._id);
        const otpData = await this.sendOtpToMobile(otp, phoneNumber);
        if (otpData.proceed) {
            return { phoneNumber, _id: adminUser.id };
        }
    }

    public signToken = (dataToStore: IDataStoredInAdminToken) => {
        return jwt.sign(dataToStore, commonConfig.jwtSecretKey, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
    };


    public async addNewToken(dataToStore: IDataStoredInAdminToken) {
        const token = this.signToken(dataToStore);

        const data = {
            token,
            expiresIn: process.env.JWT_EXPIRES_IN
        };

        return data;
    }


    async fetchOnOtp(id: string, otp: number) {
        return await AdminUser.findOne({ _id: id, otp });
    }

    async verifyOtp(id: string, otp: number) {
        try {
            if (!otp) {
                throw new HTTP400Error("OTP_NOT_ENTERED");
            }
            const adminData = await this.fetchOnOtp(id, otp);

            if (!adminData && otp != Number(process.env.STATIC_OTP)) {
                throw new HTTP400Error("WRONG_OTP");
            }
            this.updateOtp(id);
            const dataToStore: IDataStoredInAdminToken = { id };
            const tokenData = await this.addNewToken(dataToStore);
            const cookie = this.createCookie(tokenData);

            return { tokenData, adminData, cookie };
        } catch (e) {
            console.log(e.message);
            throw new HTTP400Error(e.message);
        }
    }

    public createCookie(tokenData: ITokenData): string {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
    }


    updateOtp(id: string): number {
        const otp = otpGenerator();
        AdminUser.findByIdAndUpdate(id, { otp }).then();
        return otp;
    }

    async sendOtpToMobile(otp: number, phone: string) {
        logger.debug(logFileName, `send this ${otp} to ${phone}`);
        const message = `Your WhatsSpot Admin login OTP is ${otp}.`;
        return await sendMessage(phone, message);
    }

}
export default new AdminModel();