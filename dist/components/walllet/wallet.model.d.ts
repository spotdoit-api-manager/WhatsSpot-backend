import { IWalletModel } from "./wallet.schema";
export declare class WalletModel {
    createWallet(balance?: number): Promise<IWalletModel>;
    fetchWalletByUserId(userId: string): Promise<IWalletModel>;
    fetchWalletBalance(userId: string, walletId: string): Promise<any>;
    fetchTransactions(userId: string, walletId: string): Promise<any[]>;
    private fetchWallet;
    addUserToWallet(walletId: string, userId: string): Promise<IWalletModel>;
    addCreditToWallet(walletId: string, addBalance?: number): Promise<IWalletModel>;
}
declare const _default: WalletModel;
export default _default;
