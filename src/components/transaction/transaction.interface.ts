import { EPayWith } from "./../../core/enums/pay-with.enum";

export interface ITransaction{
    amount: number;
    type: ETransactionTypes;
    userId: string;
    walletId: string;
    orderId: string;
    description?: string;
    status: ETransactionStatus;
    method: EPayWith;
    metaData: any;
}

export enum ETransactionTypes{
    CREDIT="CREDIT",
    DEBIT="DEBIT"
}

export enum ETransactionStatus{
    ERROR="ERROR",
    PENDING="PENDING",
    SUCCESS="SUCCESS",
    EXPIRED="EXPIRED",
    CANCELLED="CANCELLED"
}