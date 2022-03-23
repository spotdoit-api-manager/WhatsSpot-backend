export interface IPLAN{
    planId:string,
planName:string,
planAmount:number,
planPeriod:number,
planPeriodUnit:string,
planInfo:String[],
planMaxMessage:number|null,
isBest:boolean
}

export enum EPLANS{
PAYG="PAYG",
MONTHLY="MONTHLY",
MEMBERSHIP="MEMBERSHIP"
}


export interface IUserPlan{
    planName:string,
    userId:string,
    planTransactionId:string,
    planId:string,
    sentMessageCount: number,
    startDate:Date,
    endDate:Date,
    planStatus:EPlanStatus
}

export enum EPlanStatus{
    ACTIVE="ACTIVE",
    EXPIRED="EXPIRED"
}