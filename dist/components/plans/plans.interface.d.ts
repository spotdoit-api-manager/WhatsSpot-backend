export interface IPLAN {
    planId: string;
    planName: string;
    planAmount: number;
    planPeriod: number;
    planPeriodUnit: string;
    planInfo: string[];
    planMaxMessage: number | null;
    isBest: boolean;
    stripePriceId: string;
    maxDevices: number;
}
export declare enum EPLANS {
    PAYG = "PAYG",
    MONTHLY = "MONTHLY",
    SUBSCRIPTION = "SUBSCRIPTION",
    PREMIUM = "PREMIUM",
    MEMBERSHIP = "MEMBERSHIP"
}
export interface IUserPlan {
    planName: string;
    userId: string;
    planTransactionId: string;
    planId: string;
    sentMessageCount: number;
    startDate: Date;
    endDate: Date;
    planStatus: EPlanStatus;
    webHookRequest: number;
}
export declare enum EPlanStatus {
    ACTIVE = "ACTIVE",
    EXPIRED = "EXPIRED",
    EXHAUSTED = "EXHAUSTED"
}
