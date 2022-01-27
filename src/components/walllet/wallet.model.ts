import { HTTP401Error } from './../../lib/utils/httpErrors';
import { ObjectID } from 'bson';
import { NextFunction } from "express";
import ResponseHandler from "../../lib/helpers/responseHandler";
import { IWallet } from './wallet.interface';
import { IWalletModel, Wallet } from "./wallet.schema";
import transactionModel from '../transaction/transaction.model';

export class WalletModel {


    public async createWallet(balance: number = 0) {

        const newWallet = new Wallet({ balance: balance });
        const newWalletData = await newWallet.save();
        console.log(newWalletData);

        return newWalletData;
    }

    public async fetchWalletByUserId(userId: string) {
        return await Wallet.findOne({ userId: new ObjectID(userId) })
    }
    public async fetchWalletBalance(userId: string, walletId: string) {
        console.log("fetch wallet balance ", userId, walletId);
        const walletData = this.fetchWallet(walletId)
        return walletData;
    }

    public async fetchTransactions(userId: string, walletId: string) {
        console.log("fetch wallet transaciton ", userId, walletId);
        const transactions = await transactionModel.fetchTransactions(walletId);
        return transactions;
    }

    private async fetchWallet(walletId) {
        const result = await Wallet.aggregate([
            { $match: { _id: walletId } },
            {
                $project: {
                    balance: 1
                }
            }
        ]);
        return result[0] || null;
    }

    public async addUserToWallet(walletId:string,userId:string){
        return await Wallet.findByIdAndUpdate(walletId,{userId});
    }

        public async addCreditToWallet(walletId:string,addBalance:number=0){
        const result = await Wallet.findByIdAndUpdate(walletId, { $inc: { balance:addBalance } });
        if(!result) throw new HTTP401Error("ERROR_UPDATING_WALLET_BALANCE");
        return result;
        }
   

}

export default new WalletModel();
