import { ITransactionModel } from "../transaction/transaction.schema";
import { ETransactionTypes } from "../transaction/transaction.interface";
import { EPayWith } from "../../core/enums/pay-with.enum";
import { EPLANS } from "../plans/plans.interface";
import plansModel from "../plans/plans.model";
import transactionModel from "../transaction/transaction.model";

export class QrPayModel{
public async createOrder(userId: string,walletId: string,planId: EPLANS,amount: number){
    const plan = await plansModel.fetchPlanByPlanId(planId);
    const transactionMessage = plan.planId == "PAYG" ?"Adding money to wallet":`Buying plan -> ${plan.planName}`;

    const transaction: ITransactionModel = await transactionModel.createTransactionForPlan(plan.planId,EPayWith.QR_PAY,userId,walletId,ETransactionTypes.CREDIT,amount,transactionMessage);
        return transaction;
}   
}

export default new QrPayModel();