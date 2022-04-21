import { HTTP401Error } from "./../../lib/utils/httpErrors";
import { ObjectID } from "bson";
import { NextFunction } from "express";
import ResponseHandler from "../../lib/helpers/responseHandler";
import { IWallet } from "./wallet.interface";
import { IWalletModel, Wallet } from "./wallet.schema";
import transactionModel from "../transaction/transaction.model";
import { ETransactionTypes } from "../transaction/transaction.interface";
import logger from "../../core/logger";
const logFileName = "[WalletModel] : ";
export class WalletModel {


    public async createWallet(balance: number = 0) {
        const newWallet = new Wallet({ balance: balance });
        const newWalletData = await newWallet.save();
        logger.info(logFileName,`New Wallet Created ${newWalletData._id}`);
        return newWalletData;
    }

  
    public async fetchWalletBalance(userId: string, walletId: string) {
        console.log("fetch wallet balance ", userId, walletId);
        const walletData = this.fetchWallet(walletId);
        return walletData;
    }

    public async fetchTransactions(userId: string, walletId: string) {
        console.log("fetch wallet transaciton ", userId, walletId);
        const transactions = await transactionModel.fetchTransactions(walletId);
        return transactions;
    }

    private async fetchWallet(walletId: string) {
        const result = await Wallet.aggregate([
            { $match: { _id: new ObjectID(walletId) } },
            {
                $project: {
                    balance: 1
                }
            }
        ]);
        console.log("wallet result ",result);
        
        return result[0] || null;
    }

    public async fetchWalletByUserId(userId: string) {
        const result = await Wallet.aggregate([
            { $match: { userId: new ObjectID(userId) } },
            {
                $project: {
                    balance: 1
                }
            }
        ]);
        console.log("wallet result ",result);
        
        return result[0] || null;
    }
    public async getWalletIdByUserId(userId: string){
        const wallet: IWalletModel = await Wallet.findOne({userId:new ObjectID(userId)});
        if(!wallet)throw Error("WALLET_NOT_FOUND");
        return wallet._id;
    }

    public async addUserToWallet(walletId: string,userId: string){
        return await Wallet.findByIdAndUpdate(walletId,{userId});
    }

        public async addCreditToWallet(walletId: string,addCredit: number){
        const result = await Wallet.findByIdAndUpdate(walletId, { $inc: { balance:addCredit } });
        if(!result) throw new HTTP401Error("ERROR_UPDATING_WALLET_BALANCE");
        return result;
        }

        public async validateTransactionAmount(walletId: string,amountToDebit: number){
            const wallet = await this.fetchWallet(walletId);
            logger.info(logFileName,`Validating transaction amount ${amountToDebit} for wallet ${walletId}`);
            
            if(!wallet) throw new Error("WALLET_NOT_FOUND");
            if(wallet.balance>=amountToDebit) return {isValidAmount:true,balance:wallet.balance};
            return {isValidAmount:false,balance:wallet.balance};
        }



      public async getWalletIdAndValidateTransactionAmount(userId: string,amountToDebit: number){
        const wallet: IWalletModel|null = await this.fetchWalletByUserId(userId);     
        if(!wallet) throw new Error("WALLET_NOT_FOUND");
        if(wallet.balance>=amountToDebit) return wallet._id;
        throw new Error("NOT_ENOUGH_CREDITS");  
      }

        public async removeCreditFromWallet(walletId: string,removeCredit: number){
           await this.validateTransactionAmount(walletId,removeCredit);
            const result = await Wallet.findByIdAndUpdate(walletId, { $inc: { balance:-removeCredit } },{new:true});
            if(!result) throw new HTTP401Error("ERROR_UPDATING_WALLET_BALANCE");
            return result;
            }
    
        public async makePaymentFromWallet(walletId: string,userId: string,amount: number,description: string,metaData: Record<string, any>={}){            
            const transaction = transactionModel.createTransactionForWallet(walletId,userId,ETransactionTypes.DEBIT,amount,description,metaData);
            const wallet = await this.removeCreditFromWallet(walletId,amount);
            return {error:false,transaction,wallet};
        }
   

}

export default new WalletModel();
