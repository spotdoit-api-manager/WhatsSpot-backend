export interface ITransaction {
    amount: number;
    type: ETransactionTypes;
    userId: string;
    walletId: string;
    description?: string;
    status: ETransactionStatus;
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
