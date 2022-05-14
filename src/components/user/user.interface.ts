/* eslint-disable @typescript-eslint/interface-name-prefix */
// import { Interface } from "readline";

export interface IUser {
    userName?: string;
    password?: string;
    email?: string;
    role: string;
    phone: string;
    otp?: number;
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
}

export interface IPlanRef{
    planName: string;
    planRef: string;
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