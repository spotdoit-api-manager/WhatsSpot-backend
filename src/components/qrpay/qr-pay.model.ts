/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ETransactionStatus } from "./../transaction/transaction.interface";
import { HTTP401Error } from "./../../lib/utils/httpErrors";
import { ITransactionModel } from "../transaction/transaction.schema";
import { ETransactionTypes } from "../transaction/transaction.interface";
import { EPayWith } from "../../core/enums/pay-with.enum";
import { EPLANS } from "../plans/plans.interface";
import plansModel from "../plans/plans.model";
import transactionModel from "../transaction/transaction.model";
import notifyService from "../../lib/services/notify.service";
import walletModel from "../wallet/wallet.model";

export class QrPayModel {
    public async createOrder(userId: string, walletId: string, transactionId: string, planId: EPLANS, amount: number) {
        if (!transactionId || transactionId.length < 10 || !amount) throw new HTTP401Error("INVALID TRANSACTION ID", "Entered transaction id is invalid or  amount is invalid");
        const plan = await plansModel.fetchPlanByPlanId(planId);
        if (!plan) throw new HTTP401Error("INVALID PLAN ID", "Entered plan id is invalid");
        const transactionMessage = plan.planId == "PAYG" ? `Payment Request (Add Money to wallet) | TransactionId: ${transactionId}` : `Payment request to Buy Plan -> ${plan.planName} | TransactionId: ${transactionId}`;
        const isAlreadyExist = await transactionModel.fetchTransactionByOrderId(transactionId);
        if (isAlreadyExist) throw new HTTP401Error("TRANSACTION ID ALREADY REQUESTED", "Entered transaction id is already exist");
        const transaction: ITransactionModel = await transactionModel.createTransactionForPlan(plan.planId, transactionId, userId, walletId, ETransactionTypes.CREDIT, amount, transactionMessage, EPayWith.QR_PAY);
        notifyService.paymentApproveRequest(userId, planId,amount,transactionId);
        return transaction;
    }


    public async approvePayment(userId: string, paymentId: string) {
        const payment: ITransactionModel = await transactionModel.fetchTransactionById(null, paymentId);
        if (!payment) throw new HTTP401Error("INVALID PAYMENT ID", "Entered payment id is invalid");
        if (payment.status == ETransactionStatus.SUCCESS) throw new HTTP401Error("PAYMENT ALREADY APPROVED", "Entered payment id is already approved");
        if (payment.metaData.planId == "PAYG") {
            await walletModel.addBalanceToWallet(payment.userId,payment.walletId, payment.amount);
        } else {
            await plansModel.activateUserPlan(userId, payment.userId, payment.metaData.planId, "Payment Request Approved");
        }
        notifyService.paymentApprove(payment.userId, payment.metaData.planId,payment.amount,payment.orderId);
        return transactionModel.updateTransactionStatus(paymentId, ETransactionStatus.SUCCESS);
    }
    public async rejectPayment(userId: string, paymentId: string,reason: string) {
        const payment: ITransactionModel = await transactionModel.fetchTransactionById(null, paymentId);
        if (!payment) throw new HTTP401Error("INVALID PAYMENT ID", "Entered payment id is invalid");
        if (payment.status == ETransactionStatus.SUCCESS) throw new HTTP401Error("PAYMENT ALREADY APPROVED", "Entered payment id is already approved");
       
        notifyService.paymentRejected(payment.userId, payment.metaData.planId,payment.amount,payment.orderId,reason);
        return transactionModel.updateTransactionStatus(paymentId, ETransactionStatus.ERROR);
    }
}

export default new QrPayModel();