import { IUser, ITokenData, IDataStoredInToken } from "./user.interface";
import { IUserModel } from "./user.schema";
export declare class UserModel {
    fetchAll(): Promise<IUserModel[]>;
    private findUserById;
    fetch(id: string): Promise<any>;
    update(id: string, body: IUserModel): Promise<IUserModel>;
    fetchUserActivePlan(userId: string): Promise<any>;
    addPlanToUser(userId: string, activePlanName: string, activePlanId: string): Promise<void>;
    expireUserPlan(userId: string): Promise<void>;
    delete(id: string): Promise<void>;
    add(body: any): Promise<{
        _id: any;
    }>;
    createNewUser(body: IUser): Promise<IUserModel>;
    registerWithPhone(body: IUser): Promise<{
        phone: string;
        _id: any;
    }>;
    loginWithPhone(body: IUser): Promise<{
        phone: string;
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
    addFollower(id: string, userId: string): Promise<IUserModel>;
    addFollowing(id: string, userId: string): Promise<IUserModel>;
    addFollowRequest(id: string, userId: string): Promise<IUserModel>;
    acceptFollowRequest(id: string, userId: string): Promise<IUserModel>;
    updateOtp(id: string): number;
    sendOtpToMobile(otp: number, phone: string): Promise<{
        proceed: boolean;
        message?: undefined;
    } | {
        proceed: boolean;
        message: any;
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
    private generateValidUsername;
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
            message?: undefined;
        } | {
            proceed: boolean;
            message: any;
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
}
declare const _default: UserModel;
export default _default;
