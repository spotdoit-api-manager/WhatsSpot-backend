import { IUserModel } from "./user.schema";
export declare class UserModel {
    fetchAll(): Promise<IUserModel[]>;
    fetch(id: string): Promise<IUserModel>;
    update(id: string, body: IUserModel): Promise<IUserModel>;
    delete(id: string): Promise<void>;
    add(body: any): Promise<{
        _id: any;
    }>;
    signUp(body: IUserModel): Promise<{
        token: string;
        user: IUserModel;
    }>;
    isUserExist(body: any): Promise<void>;
    login(body: any): Promise<{
        token: string;
        user: IUserModel;
    }>;
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
        user: IUserModel;
    }>;
    addFollower(id: string, userId: string): Promise<IUserModel>;
    addFollowing(id: string, userId: string): Promise<IUserModel>;
    addFollowRequest(id: string, userId: string): Promise<IUserModel>;
    acceptFollowRequest(id: string, userId: string): Promise<IUserModel>;
    updateOtp(id: string): number;
    sendOtpToMobile(otp: number, phone: string): Promise<{
        proceed: boolean;
    } | {
        proceed: boolean;
    }>;
    signToken: (id: string) => string;
    addNewToken(id: string): Promise<{
        token: string;
        user: IUserModel;
    }>;
    fetchOnOtp(id: string, otp: number): Promise<IUserModel>;
    verifyOtp(id: string, otp: number): Promise<{
        data: any;
        token: {
            token: string;
            user: IUserModel;
        };
    }>;
    private generateValidUsername;
    private randomString;
    addPhone(body: any): Promise<{
        _id: any;
        isExisted: boolean;
        token: Promise<{
            token: string;
            user: IUserModel;
        }>;
    } | {
        _id: any;
        isExisted: boolean;
        token?: undefined;
    }>;
    genrateOTP(phone: string): Promise<{
        res: {
            proceed: boolean;
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
}
declare const _default: UserModel;
export default _default;
