import { EPlanStatus } from "./../plans/plans.interface";
import { ITransactionModel } from "./../transaction/transaction.schema";
import { ETransactionStatus, ETransactionTypes } from "../transaction/transaction.interface";
import transactionModel from "../transaction/transaction.model";
import { razorPaySecrets } from "./../../config/index";
import { HTTP401Error } from "./../../lib/utils/httpErrors";
import { ICreateOrder, IVerifyPayment } from "./razorpay.interface";
import razorPayService from "./razorpay.service";
import walletModel from "../wallet/wallet.model";
import crypto from "crypto";
import { EPLANS, IPLAN } from "../plans/plans.interface";
import plansModel from "../plans/plans.model";
import logger from "../../core/logger";
import userModel from "../user/user.model";
const logFileName = "[RazorPayModel]";
export class RazorPayModel {
    public async createOrder(userId: string,walletId: string, planId: EPLANS,amount: number) {
        try {
            logger.info(logFileName,planId,amount);
            const plan: IPLAN = await plansModel.fetchPlanByPlanId(planId);
            if(planId!==EPLANS.PAYG){
                await userModel.checkIfUserCanActivatePlan(userId,planId);
            }

            if(!plan) throw new HTTP401Error("INVALID_PLAN");
            const order: any = await razorPayService.createOrder(userId, {planId,amount});
            if (!order) throw new HTTP401Error("UNKNOWN_ERROR");
            if (order.error) throw new HTTP401Error(order.message);
            const transactionMessage = plan.planId == "PAYG" ?"Adding money to wallet":`Buying plan -> ${plan.planName}`;
            const transaction: ITransactionModel = await transactionModel.createTransactionForPlan(plan.planId,order.order.id,userId,walletId,ETransactionTypes.CREDIT,amount,transactionMessage);
            if(!transaction) throw new HTTP401Error("UNKNOWN_ERROR");
            order.order.transactionId = transaction._id;
            order.order.planId = plan.planId;
            razorPayService.checkTransactionStatusIn(order.order.id,transaction._id);
            return {order};
        } catch (err) {
            throw new HTTP401Error(err.message);
        }
    }

    public async verifyPayment(userId: string,walletId: string,body: IVerifyPayment) {
        try{
            const id = body.orderId + "|" + body.paymentId;
            const expectedSignature = crypto.createHmac("sha256", razorPaySecrets.secret)
            .update(id.toString())
            .digest("hex");
           
            const response = { signatureIsValid: false };
        if (expectedSignature === body.razorpay_signature) {
            const transaction: ITransactionModel  = await transactionModel.updateTransactionStatus(body.transactionId,ETransactionStatus.SUCCESS);
        
            if(transaction?.metaData && transaction?.metaData?.planId != EPLANS.PAYG){
                await plansModel.activatePlan(userId,transaction.metaData.planId,transaction._id);
                 await transactionModel.updateTransactionStatus(body.transactionId,ETransactionStatus.SUCCESS);
                
            }
            else
            {                
               await walletModel.addCreditToWallet(walletId,transaction.amount);
            }
            
            response.signatureIsValid = true;
            return response;
        }        
        return response;
    }catch(err){
        console.log(err.message);
        throw new HTTP401Error(err.message);
    }
}
}

export default new RazorPayModel();