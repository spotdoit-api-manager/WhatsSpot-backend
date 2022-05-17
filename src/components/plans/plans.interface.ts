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
}

export enum EPLANS{
PAYG="PAYG",
MONTHLY="MONTHLY",
MEMBERSHIP="MEMBERSHIP"
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