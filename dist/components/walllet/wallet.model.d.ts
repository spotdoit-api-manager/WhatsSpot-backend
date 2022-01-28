import { IWalletModel } from "./wallet.schema";
export declare class WalletModel {
    createWallet(balance?: number): Promise<IWalletModel>;
    fetchWalletByUserId(userId: string): Promise<IWalletModel>;
    fetchWalletBalance(userId: string, walletId: string): Promise<any>;
    fetchTransactions(userId: string, walletId: string): Promise<any[]>;
    private fetchWallet;
    addUserToWallet(walletId: string, userId: string): Promise<IWalletModel>;
    addCreditToWallet(walletId: string, addCredit: number): Promise<IWalletModel>;
    validateTransactionAmount(walletId: string, amountToDebit: number): Promise<boolean>;
    removeCreditFromWallet(walletId: string, removeCredit: number): Promise<IWalletModel>;
    makePaymentFromWallet(walletId: string, userId: string, amount: number, description: string, metaData?: Object): Promise<{
        error: boolean;
        transaction: Promise<import("../transaction/transaction.schema").ITransactionModel>;
        wallet: IWalletModel;
    }>;
}
declare const _default: WalletModel;
export default _default;
