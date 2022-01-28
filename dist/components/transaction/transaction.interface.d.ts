export interface ITransaction {
    amount: number;
    type: ETransactionTypes;
    userId: string;
    walletId: string;
    orderId: string;
    description?: string;
    status: ETransactionStatus;
    metaData: any;
}
export declare enum ETransactionTypes {
    CREDIT = "CREDIT",
    DEBIT = "DEBIT"
}
export declare enum ETransactionStatus {
    ERROR = "ERROR",
    PENDING = "PENDING",
    SUCCESS = "SUCCESS"
}
