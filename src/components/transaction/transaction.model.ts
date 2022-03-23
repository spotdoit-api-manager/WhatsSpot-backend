import { ObjectID } from 'bson';
import { HTTP401Error } from './../../lib/utils/httpErrors';
import { Transaction, ITransactionModel } from './transaction.schema';
import { ETransactionStatus, ETransactionTypes, ITransaction } from "./transaction.interface";
import { any } from 'async';

export class TransactionModel {

public fetchTransactionById(walletId,transactionId){
        return Transaction.findOne({walletId:new ObjectID(walletId),_id:new ObjectID(transactionId)})
}

    public async fetchTransactions(walletId:string) {
        const result = await Transaction.aggregate([
            { $match: { walletId: new ObjectID(walletId) } },
            { $sort: { createdAt: -1 } },
            {
                $project: {
                    amount: 1,
                    status: 1,
                    type: 1,
                    dateTime:"$createdAt",
                    description:1,
                    
                }
            }
           
        ]);
        return result;
    }

    

    public async createTransactionForRazorPay(planId:string,orderId: string, userId: string, walletId: string, type: ETransactionTypes, amount: number, description: string) {
        try {

            const transactionBody:ITransaction= {
                orderId,
                userId,
                walletId,
                type,
                amount,
                description,
                metaData:{
                    planId
                },
                status: ETransactionStatus.PENDING
            }
            const newTransaction: ITransactionModel = new Transaction(transactionBody);
            const transaction: ITransactionModel = await newTransaction.addTransaction();
            if (!transaction) throw new HTTP401Error("UNKNOW_ERROR");
            return transaction;
        } catch (err) {
            throw new HTTP401Error(err.message)
        }
    }


    public async createTransactionForWallet(walletId: string, userId: string, type: ETransactionTypes, amount: number, description: string,metaData:Object={}) {
        try {            
            const orderId = new ObjectID();
            const transactionBody:ITransaction = {
                orderId:String(orderId),
                userId,
                walletId,
                type,
                amount,
                metaData,
                description,
                status: ETransactionStatus.SUCCESS
            }
            console.log("transaction body is ",transactionBody);
            
            const newTransaction: ITransactionModel = new Transaction(transactionBody);
            console.log("transaction is ",newTransaction);
            
            const transaction: ITransactionModel = await newTransaction.addTransaction();
            if (!transaction) throw new HTTP401Error("UNKNOW_ERROR");
            return transaction;
        } catch (err) {
            throw new HTTP401Error(err.message)
        }
    }


    public async updateTransactionStatus(transactionId: string, status: ETransactionStatus) {
        const updatedTransaction = await Transaction.findByIdAndUpdate(transactionId, { $set: { status: status } },{new:true});
        if (!updatedTransaction) throw new HTTP401Error("ERROR_UPDATING_TRANSACTION_STATUS");
        return updatedTransaction;
    }
}

export default new TransactionModel()