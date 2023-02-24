import { IWalletModel } from "./wallet.schema";
export declare class WalletModel {
    createWallet(balance?: number): Promise<IWalletModel>;
    deleteWallet(walletId: string): Promise<void>;
    fetchWalletBalance(userId: string, walletId: string): Promise<any>;
    getTotalWalletBalance(): Promise<any>;
    updateWalletBalance(walletId: string, balance: number): Promise<IWalletModel>;
    addBalanceToWallet(userId: string, walletId: string, amount: number, currency?: string): Promise<IWalletModel>;
    fetchTransactions(userId: string, walletId: string, page?: number): Promise<{
        data: any;
        pagination: {
            currentPage: number;
            total: number;
            limit: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    private fetchWallet;
    fetchWalletByUserId(userId: string): Promise<any>;
    getWalletIdByUserId(userId: string): Promise<any>;
    addUserToWallet(walletId: string, userId: string): Promise<IWalletModel>;
    addCreditToWallet(walletId: string, addCredit: number): Promise<IWalletModel>;
    validateTransactionAmount(walletId: string, amountToDebit: number): Promise<{
        isValidAmount: boolean;
        balance: any;
    }>;
    getWalletIdAndValidateTransactionAmount(userId: string, amountToDebit: number): Promise<any>;
    removeCreditFromWallet(walletId: string, removeCredit: number): Promise<IWalletModel>;
    makePaymentFromWallet(walletId: string, userId: string, amount: number, description: string, metaData?: Record<string, any>): Promise<{
        error: boolean;
        transaction: import("../transaction/transaction.schema").ITransactionModel;
        wallet: IWalletModel;
    }>;
}
declare const _default: WalletModel;
export default _default;
