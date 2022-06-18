import { ITokenData, IDataStoredInToken, IUserNotificationSettings, IUserProfile } from "./user.interface";
import { IUserModel } from "./user.schema";
import { CountryCode } from "libphonenumber-js";
export declare class UserModel {
    fetchAll(): Promise<IUserModel[]>;
    private findUserById;
    fetchUserMetrics(): Promise<{
        totalUsers: number;
    }>;
    fetch(id: string): Promise<any>;
    update(id: string, body: IUserModel): Promise<IUserModel>;
    fetchUserDetailedActivePlan(userId: string): Promise<any>;
    fetchUserActivePlan(userId: string): Promise<any>;
    addPlanToUser(userId: string, activePlanName: string, activePlanId: string): Promise<void>;
    removeUserActivePlan(userId: string, planRef: string): Promise<void>;
    checkIfUserCanActivatePlan(userId: string, planId: string): Promise<boolean>;
    delete(id: string): Promise<void>;
    add(body: any): Promise<{
        _id: any;
    }>;
    createNewUser(phone: string, email: string, userName: string, country: CountryCode): Promise<IUserModel>;
    registerWithPhone(phone: string, email: string, userName: string, country: CountryCode): Promise<{
        phone: import("libphonenumber-js/types").Tagged<string, "E164Number">;
        _id: any;
    }>;
    loginWithPhone(phone: string, country: CountryCode): Promise<{
        phone: import("libphonenumber-js/types").Tagged<string, "E164Number">;
        _id: any;
    }>;
    resendOTP(id: string, body: any): Promise<{
        phone: any;
        _id: any;
    }>;
    private findUserByPhone;
    signUp(body: IUserModel): Promise<{
        token: string;
        expiresIn: string;
    }>;
    isUserExist(body: any): Promise<void>;
    login(body: any): Promise<{
        token: string;
        expiresIn: string;
    }>;
    verifyUser(otp: string, userId: string): Promise<{
        proceed: boolean;
    }>;
    isUserExistByPhone(phone: string): Promise<IUserModel>;
    authenticateWithAccesToken(data: any): Promise<{
        userInfo: IUserModel;
        isExisted: boolean;
        data?: undefined;
    } | {
        data: any;
        isExisted: boolean;
        userInfo?: undefined;
    }>;
    loginViaSocialAccessToken(body: any): Promise<{
        token: string;
        expiresIn: string;
    }>;
    updateOtp(id: string): number;
    updateDeviceCode(userId: string, phone: string): Promise<number>;
    validateDeviceCode(userId: string, devicePhone: string, code: number): Promise<void>;
    sendOtpToMobile(otp: number, phone: string): Promise<{
        proceed: boolean;
        message: any;
    } | {
        proceed: boolean;
    }>;
    signToken: (dataToStore: IDataStoredInToken) => string;
    addNewToken(dataToStore: IDataStoredInToken): Promise<{
        token: string;
        expiresIn: string;
    }>;
    fetchOnOtp(id: string, otp: number): Promise<IUserModel>;
    verifyOtp(id: string, otp: number): Promise<{
        tokenData: {
            token: string;
            expiresIn: string;
        };
        data: IUserModel;
        cookie: string;
    }>;
    createCookie(tokenData: ITokenData): string;
    private generateValiduserName;
    private randomString;
    addPhone(body: any): Promise<{
        _id: any;
        isExisted: boolean;
        token: Promise<{
            token: string;
            expiresIn: string;
        }>;
    } | {
        _id: any;
        isExisted: boolean;
        token?: undefined;
    }>;
    genrateOTP(phone: string): Promise<{
        res: {
            proceed: boolean;
            message: any;
        } | {
            proceed: boolean;
        };
        proceed: boolean;
    } | {
        proceed: boolean;
        res?: undefined;
    }>;
    addPhoneNumber(id: string, phone: string): Promise<{
        _id: any;
        isExisted: boolean;
    }>;
    isUserVerified(id: string): Promise<{
        proceed: boolean;
        phone: string;
    } | {
        proceed: boolean;
        phone?: undefined;
    }>;
    getAccountMetrics(userId: string): Promise<any>;
    fetchUsersBaseList(): Promise<any[]>;
    userDetailedAccountMetrics(userId: string): Promise<any[]>;
    updateNotificationSettings(userId: string, notificationSetting: IUserNotificationSettings): Promise<any>;
    updateProfile(userId: string, profileBody: IUserProfile): Promise<any>;
    sendEmailVerification(userId: string): Promise<void>;
    verifyEmaliOtp(userId: string, otp: string): Promise<any>;
}
declare const _default: UserModel;
export default _default;
