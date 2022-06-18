import { EPayWith } from "./../../core/enums/pay-with.enum";
import { ObjectID } from "bson";
import { HTTP401Error } from "./../../lib/utils/httpErrors";
import { Transaction, ITransactionModel } from "./transaction.schema";
import { ETransactionStatus, ETransactionTypes, ITransaction } from "./transaction.interface";
import { any } from "async";
import logger from "../../core/logger";
import { getSkipLimit } from "../../lib/utils";
const logFileName = "[TransactionModel] : ";
export class TransactionModel {

public fetchTransactionById(walletId: string="",transactionId: string){
        return Transaction.findById(transactionId).lean();
}

public async fetchTransactionByMethod(method: EPayWith,status: ETransactionStatus|null,page: number=1){
    console.log("fetchTransactionByMethod",status);
        // const {skip,limit} = getSkipLimit(page);
        let condition: {method: EPayWith;status?: ETransactionStatus};
        if(status){
             condition  = {method:method,status:status };
        }else{
            condition  = { method:method };
        }
      
        const result = await Transaction.aggregate([
            { $match:condition},
            { $sort: { createdAt: -1 } },
            // { $skip: skip },
            // { $limit: limit }
        ]);
        console.group("result is ",result);
        return result;
}

    public async fetchTransactions(walletId: string,page: number) {
        const {skip,limit} = getSkipLimit(page);
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
            },

           {$skip:skip},
           {$limit:limit},
        ]);
        return result;
    }

    

    public async createTransactionForPlan(planId: string,orderId: string, userId: string, walletId: string, type: ETransactionTypes, amount: number, description: string,method: EPayWith) {
        try {

            const transactionBody: ITransaction= {
                orderId,
                userId,
                walletId,
                type,
                amount,
                description,
                method,
                metaData:{
                    planId
                },
                status: ETransactionStatus.PENDING
            };
            const newTransaction: ITransactionModel = new Transaction(transactionBody);
            const transaction: ITransactionModel = await newTransaction.addTransaction();
            if (!transaction) throw new HTTP401Error("UNKNOW_ERROR");
            return transaction;
        } catch (err) {
            throw new HTTP401Error(err.message);
        }
    }


    public async createTransactionForWallet(walletId: string, userId: string, type: ETransactionTypes, amount: number, description: string,metaData: Record<string, any>={},method: EPayWith) {
        try {            
            const orderId = new ObjectID();
            const transactionBody: ITransaction = {
                orderId:String(orderId),
                userId,
                walletId,
                type,
                amount,
                metaData,
                method,
                description,
                status: ETransactionStatus.PENDING
            };
            
            const newTransaction: ITransactionModel = new Transaction(transactionBody);
            
            const transaction: ITransactionModel = await newTransaction.addTransaction();
            if (!transaction) throw new HTTP401Error("UNKNOW_ERROR");
            return transaction;
        } catch (err) {
            throw new HTTP401Error(err.message);
        }
    }


    public async updateTransactionStatus(transactionId: string, status: ETransactionStatus) {
        const updatedTransaction = await Transaction.findByIdAndUpdate(transactionId, { $set: { status: status } },{new:true}).lean();
        if (!updatedTransaction) throw new HTTP401Error("ERROR_UPDATING_TRANSACTION_STATUS");
        return updatedTransaction;
    }

    public fetchTransactionByOrderId(orderId: string) {
        return Transaction.findOne({ orderId: orderId }).lean();
    }
}

export default new TransactionModel();