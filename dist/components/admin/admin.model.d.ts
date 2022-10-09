import { IStripePrice, IStripeProduct } from "./../stripe/stripe.interface";
import { IAdminUser, IDataStoredInAdminToken } from "./admin.interface";
import { IAdminUserModel } from "./admin.schema";
import { ITokenData } from "../user/user.interface";
import { ETransactionStatus } from "../transaction/transaction.interface";
export declare class AdminModel {
    fetch(id: string): Promise<IAdminUserModel>;
    updateUserWalletBalance(walletId: string, balance: number): Promise<import("../wallet/wallet.schema").IWalletModel>;
    walletTransactions(walletId: string): Promise<any[]>;
    metrics(): Promise<{
        devicesMetrics: {
            totalDevices: number;
            activeDevices: number;
            deletedDevices: number;
        };
        usersMetrics: {
            totalUsers: number;
        };
        walletBalance: any;
    }>;
    devicesList(adminId: string): Promise<any>;
    fetchUsersBaseList(): Promise<any[]>;
    userDetailedAccountMetrics(userId: string): Promise<any[]>;
    getDeviceData(deviceId: string): Promise<any>;
    addNewAdmin(adminId: string, body: IAdminUser): Promise<IAdminUserModel>;
    fetchAdmins(): Promise<IAdminUserModel[]>;
    convertToSuperAdmin(superAdminId: string, adminId: string): Promise<IAdminUserModel>;
    convertToNormalAdmin(superAdminId: string, adminId: string): Promise<IAdminUserModel>;
    removeAdmin(superAdminId: string, adminId: string): Promise<IAdminUserModel>;
    private findAdminUserByPhone;
    loginWithPhone(phoneNumber: string): Promise<{
        phoneNumber: string;
        _id: any;
    }>;
    signToken: (dataToStore: IDataStoredInAdminToken) => string;
    addNewToken(dataToStore: IDataStoredInAdminToken): Promise<{
        token: string;
        expiresIn: string;
    }>;
    fetchOnOtp(id: string, otp: number): Promise<IAdminUserModel>;
    verifyOtp(id: string, otp: number): Promise<{
        tokenData: {
            token: string;
            expiresIn: string;
        };
        adminData: IAdminUserModel;
        cookie: string;
    }>;
    createCookie(tokenData: ITokenData): string;
    updateOtp(id: string): number;
    sendOtpToMobile(otp: number, phone: string): Promise<{
        proceed: boolean;
        message?: undefined;
    } | {
        proceed: boolean;
        message: any;
    }>;
    addProduct(adminId: string, productBody: IStripeProduct): Promise<any>;
    getProducts(userId: string, limit: number): Promise<any>;
    createPrice(userId: string, priceBody: IStripePrice): Promise<void>;
    getPrices(userId: string, limit: number): Promise<any>;
    fetchPaymentsRequests(userId: string, status: ETransactionStatus, page: number): Promise<any[]>;
    approvePayment(userId: string, paymentId: string): Promise<any>;
    rejectPayment(userId: string, paymentId: string, reason: string): Promise<any>;
    sendEmail(adminId: string, to: string, subject: string, message: string): Promise<void>;
}
declare const _default: AdminModel;
export default _default;
