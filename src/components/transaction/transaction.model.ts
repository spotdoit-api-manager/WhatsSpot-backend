import { ObjectID } from 'bson';
import { HTTP401Error } from './../../lib/utils/httpErrors';
import { Transaction, ITransactionModel } from './transaction.schema';
import { ETransactionStatus, ETransactionTypes } from "./transaction.interface";

export class TransactionModel {

    public async fetchTransactions(walletId) {
        const result = await Transaction.aggregate([
            { $match: { walletId: new ObjectID(walletId) } },
            { $sort: { createdAt: -1 } },
            {
                $project: {
                    amount: 1,
                    status: 1,
                    type: 1
                }
            }
        ]);
        console.log("got transaciton", result);
        return result;
    }

    public async createTransaction(orderId: string, userId: string, walletId: string, type: ETransactionTypes, amount: number, description: string) {
        try {

            const transactionBody = {
                orderId,
                userId,
                walletId,
                type,
                amount,
                description,
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

    public async updateTransactionStatus(transactionId: string, status: ETransactionStatus) {
        const updatedTransaction = await Transaction.findByIdAndUpdate(transactionId, { $set: { status: status } });
        if (!updatedTransaction) throw new HTTP401Error("ERROR_UPDATING_TRANSACTION_STATUS");
        return updatedTransaction;
    }
}

export default new TransactionModel()