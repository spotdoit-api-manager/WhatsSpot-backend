import { HTTP401Error } from "./../../lib/utils/httpErrors";
import { ITransactionModel } from "../transaction/transaction.schema";
import { ETransactionTypes } from "../transaction/transaction.interface";
import { EPayWith } from "../../core/enums/pay-with.enum";
import { EPLANS } from "../plans/plans.interface";
import plansModel from "../plans/plans.model";
import transactionModel from "../transaction/transaction.model";
import notifyService from "../../lib/services/notify.service";

export class QrPayModel{
public async createOrder(userId: string,walletId: string,transactionId: string,planId: EPLANS,amount: number){
    if(!transactionId  || transactionId.length<10 || !amount) throw new HTTP401Error("INVALID TRANSACTION ID","Entered transaction id is invalid or  amount is invalid");
    const plan = await plansModel.fetchPlanByPlanId(planId);
    if(!plan) throw new HTTP401Error("INVALID PLAN ID","Entered plan id is invalid");
    const transactionMessage = plan.planId == "PAYG" ?`Payment Request (Add Money to wallet) | TransactionId: ${transactionId}`:`Payment request to Buy Plan -> ${plan.planName} | TransactionId: ${transactionId}`;
    const isAlreadyExist = await transactionModel.fetchTransactionByOrderId(transactionId);
    if(isAlreadyExist) throw new HTTP401Error("TRANSACTION ID ALREADY REQUESTED","Entered transaction id is already exist");
    const transaction: ITransactionModel = await transactionModel.createTransactionForPlan(plan.planId,transactionId,userId,walletId,ETransactionTypes.CREDIT,amount,transactionMessage,EPayWith.QR_PAY);
    notifyService.paymentApproveRequest(userId,planId,transaction._id);
    return transaction;
}   
}

export default new QrPayModel();