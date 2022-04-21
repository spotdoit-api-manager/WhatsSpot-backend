export interface IPLAN {
    planId: string;
    planName: string;
    planAmount: number;
    planPeriod: number;
    planPeriodUnit: string;
    planInfo: string[];
    planMaxMessage: number | null;
    isBest: boolean;
}
export declare enum EPLANS {
    PAYG = "PAYG",
    MONTHLY = "MONTHLY",
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
}
export declare enum EPlanStatus {
    ACTIVE = "ACTIVE",
    EXPIRED = "EXPIRED"
}
