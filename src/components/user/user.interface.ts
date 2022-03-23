// import { Interface } from "readline";

export interface IUser {
    firstName?: string;
    lastName?: string;
    username?: string;
    password?: string;
    email?: string;
    role: string;
    phone: string;
    facebookId?: string;
    otp?: number;
    isVerified: boolean;
    dateOfBirth?: Date;
    followers?: Array<string>;
    following?: Array<string>;
    avatar?: Buffer,
    deactivation: boolean;
    walletId?:string,
    activePlan:IPlanRef,
    previousPlans:IPlanRef[]
}

export interface IPlanRef{
    planName:string,
    planRef:string
}

export interface ITokenData {
    token: string;
    expiresIn: string;
}

export interface IDataStoredInToken{
    id:string,
    walletId:string
}