
// import { Interface } from "readline";

export interface IUser {
    userName?: string;
    password?: string;
    email?: string;
    role: string;
    phone: string;
    otp?: number;
    emailOtp?: number;
    isVerified: boolean;
    dateOfBirth?: Date;
    followers?: Array<string>;
    following?: Array<string>;
    avatar?: Buffer;
    deactivation: boolean;
    walletId?: string;
    activePlans?: IPlanRef[];
    previousPlans?: IPlanRef[];
    deviceCodes?: {[key: string]: string};
    country: string;
    settings?: IUserSettings;
    emailVerified: boolean;
}

export interface IUserProfile{
    userName?: string;
    country?: string;    
}

export interface IPlanRef{
    planName: string;
    planRef: string;
}

export interface IUserSettings{
    notifications: IUserNotificationSettings;
}

export interface IUserNotificationSettings{
    
        device: IUserNotificationChannels;
        plan: IUserNotificationChannels;

}


export interface IUserNotificationChannels{
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
}

export interface ITokenData {
    token: string;
    expiresIn: string;
}

export interface IDataStoredInToken{
    id: string;
    walletId: string;
}

export enum ERoles{
    ADMIN="admin",
    USER="user"
}