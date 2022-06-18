import { ITransaction } from "./../transaction/transaction.interface";
import { IStripePrice, IStripeProduct } from "./../stripe/stripe.interface";
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
import stripeModel from "../stripe/stripe.model";
import transactionModel from "../transaction/transaction.model";
import { EPayWith } from "../../core/enums/pay-with.enum";
import { ETransactionStatus } from "../transaction/transaction.interface";
import qrPayModel from "../qrpay/qr-pay.model";

const logFileName = "[AdminModel] : ";
export class AdminModel {

    public async fetch(id: string) {
        return await AdminUser.findById(id);
    }

    public async updateUserWalletBalance(walletId: string, balance: number) {
        return await walletModel.updateWalletBalance(walletId, balance);
    }

    public async walletTransactions(walletId: string) {
        return await walletModel.fetchTransactions(null, walletId);
    }

    public async metrics() {
        const devicesMetrics = await deviceModel.fetchDevicesMetrics();
        const usersMetrics = await userModel.fetchUserMetrics();
        const walletBalance = await walletModel.getTotalWalletBalance();
        return { devicesMetrics, usersMetrics, walletBalance };
    }

    public async devicesList(adminId: string) {
        return await deviceModel.fetchDevicesList();
    }

    public async fetchUsersBaseList() {
        return await userModel.fetchUsersBaseList();
    }

    public async userDetailedAccountMetrics(userId: string) {
        return await userModel.userDetailedAccountMetrics(userId);
    }

    public async getDeviceData(deviceId: string) {
        return await deviceModel.fetchDeviceMetrics(deviceId);
    }
    public async isSuperAdmin(adminId: string): Promise<boolean> {
        const adminUser = await AdminUser.findById(adminId);
        if (!adminUser) throw new HTTP401Error("OPERATION_NOT_ALLOWED", "Only Super Admins can make Admin User Super Admin");
        if (adminUser.isSuperAdmin) {
            return true;
        }
        return false;
    }

    public async addNewAdmin(adminId: string, body: IAdminUser) {
        if (!await this.isSuperAdmin(adminId)) throw new HTTP401Error("OPERATION_NOT_ALLOWED", "new admin can only added by super admins");
        body.isSuperAdmin = false;
        const newAdminUser = new AdminUser(body);
        return await newAdminUser.save();
    }
    public async fetchAdmins() {
        return AdminUser.find({});
    }

    public async convertToSuperAdmin(superAdminId: string, adminId: string) {
        if (!await this.isSuperAdmin(superAdminId)) throw new HTTP401Error("OPERATION_NOT_ALLOWED", "Only Super Admins can make Admin User Super Admin");
        return await AdminUser.findByIdAndUpdate(adminId, { isSuperAdmin: true });
    }

    public async convertToNormalAdmin(superAdminId: string, adminId: string) {
        if (!await this.isSuperAdmin(superAdminId)) throw new HTTP401Error("OPERATION_NOT_ALLOWED", "Only Super Admins can make Admin User Normal Admin");
        return await AdminUser.findByIdAndUpdate(adminId, { isSuperAdmin: false });
    }

    public async removeAdmin(superAdminId: string, adminId: string) {
        if (!await this.isSuperAdmin(superAdminId)) throw new HTTP401Error("OPERATION_NOT_ALLOWED", "Admins can only be removed by super admins");
        return await AdminUser.findByIdAndDelete(adminId);
    }
    private findAdminUserByPhone(phone: string) {
        return AdminUser.findOne({ phoneNumber: phone });
    }
    public async loginWithPhone(phoneNumber: string) {
        const adminUser: IAdminUserModel = await this.findAdminUserByPhone(phoneNumber);
        if (!adminUser) throw new HTTP401Error("ADMIN_USER_NOT_FOUND", "Contact Super Admin to add you as admin");
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


    // !! STRIPE

    public async addProduct(adminId: string, productBody: IStripeProduct) {
        if (!await this.isSuperAdmin(adminId)) throw new HTTP401Error("OPERATION_NOT_ALLOWED", "Only Super Admins can add new Stripe Product");
        return await stripeModel.addProduct(productBody);
    }

    public getProducts(userId: string, limit: number) {
        return stripeModel.getProducts(userId, limit);
    }

    public async createPrice(userId: string, priceBody: IStripePrice) {
        return await stripeModel.createPrice(userId, priceBody);
    }

    public async getPrices(userId: string, limit: number) {
        return await stripeModel.getPrices(userId, limit);
    }

    public async fetchPaymentsRequests(userId: string, status: ETransactionStatus,page: number) {
        console.log("status",status);
        return await transactionModel.fetchTransactionByMethod(EPayWith.QR_PAY,status,page);
    }

    public async approvePayment(userId: string,paymentId: string){
        return qrPayModel.approvePayment(userId,paymentId);
    }

    public async rejectPayment(userId: string,paymentId: string,reason: string){
        return qrPayModel.rejectPayment(userId,paymentId,reason);
    }

}
export default new AdminModel();