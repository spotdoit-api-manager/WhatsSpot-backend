/* eslint-disable @typescript-eslint/interface-name-prefix */
export interface IPLAN{
    planId: string;
planName: string;
planAmount: number;
planPeriod: number;
planPeriodUnit: string;
planInfo: string[];
planMaxMessage: number|null;
isBest: boolean;
stripePriceId: string;
maxDevices: number;
}


export enum EPLANS {
    PAYG = "PAYG",
    MONTHLY = "MONTHLY", //1month
    SUBSCRIPTION = "SUBSCRIPTION", //3month
    PREMIUM = "PREMIUM", //6 month
    MEMBERSHIP = "MEMBERSHIP" // 6 month unlimited
  }
  

export interface IUserPlan{
    planName: string;
    userId: string;
    planTransactionId: string;
    planId: string;
    sentMessageCount: number;
    startDate: Date;
    endDate: Date;
    planStatus: EPlanStatus;
}

export enum EPlanStatus{
    ACTIVE="ACTIVE",
    EXPIRED="EXPIRED",
    EXHAUSTED="EXHAUSTED",
}