import { IAdminUser, IDataStoredInAdminToken } from "./admin.interface";
import { IAdminUserModel } from "./admin.schema";
import { ITokenData } from "../user/user.interface";
export declare class AdminModel {
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
    addNewAdmin(body: IAdminUser): Promise<IAdminUserModel>;
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
}
declare const _default: AdminModel;
export default _default;
