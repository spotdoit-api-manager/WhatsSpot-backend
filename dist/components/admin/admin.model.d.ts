import { EPayWith } from "./../../core/enums/pay-with.enum";
import { ETransactionStatus, ETransactionTypes } from "./../transaction/transaction.interface";
import { IStripePrice, IStripeProduct } from "./../stripe/stripe.interface";
import { IAdminUser, IDataStoredInAdminToken } from "./admin.interface";
import { IAdminUserModel } from "./admin.schema";
import { ITokenData } from "../user/user.interface";
export declare class AdminModel {
    fetch(id: string): Promise<IAdminUserModel>;
    updateUserWalletBalance(walletId: string, balance: number): Promise<import("../wallet/wallet.schema").IWalletModel>;
    walletTransactions(walletId: string): Promise<{
        data: any;
        pagination: {
            currentPage: number;
            total: number;
            limit: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
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
    devicesList(adminId: string): Promise<import("mongoose").LeanDocument<import("../device/device.schema").IDeviceModel>[]>;
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
    getProducts(userId: string, limit: string): Promise<any>;
    createPrice(userId: string, priceBody: IStripePrice): Promise<void>;
    getPrices(userId: string, limit: string): Promise<any>;
    fetchPaymentsRequests(userId: string, status: ETransactionStatus, page: string): Promise<any[]>;
    approvePayment(userId: string, paymentId: string): Promise<import("../transaction/transaction.schema").ITransactionModel>;
    rejectPayment(userId: string, paymentId: string, reason: string): Promise<import("../transaction/transaction.schema").ITransactionModel>;
    sendEmail(adminId: string, to: string, subject: string, message: string): Promise<import("winston").Logger>;
    fetchEmails(adminId: string, active: string): Promise<string[]>;
    fetchAllTransactions(adminId: string, status?: ETransactionStatus, type?: ETransactionTypes, method?: EPayWith, page?: number): Promise<{
        data: any;
        pagination: {
            currentPage: number;
            total: number;
            limit: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
}
declare const _default: AdminModel;
export default _default;
