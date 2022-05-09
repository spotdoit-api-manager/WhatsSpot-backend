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
const logFileName = "[RazorPayModel]";
export class RazorPayModel {
    public async createOrder(userId: string,walletId: string, planId: EPLANS,amount: number) {
        try {
            logger.info(logFileName,planId,amount);
            const plan: IPLAN = await plansModel.fetchPlanByPlanId(planId);
            console.log("fetched plan ",plan);
            
            if(!plan) throw new Error("INVALID_PLAN");
            const order: any = await razorPayService.createOrder(userId, {planId,amount});
            if (!order) throw new Error("UNKNOWN_ERROR");
            console.log(order);
            if (order.error) throw new Error(order.message);
            const transactionMessage = plan.planId == "PAYG" ?"Adding money to wallet":`Buying plan -> ${plan.planName}`;
            const transaction: ITransactionModel = await transactionModel.createTransactionForRazorPay(plan.planId,order.order.id,userId,walletId,ETransactionTypes.CREDIT,amount,transactionMessage);
            if(!transaction) throw new Error("UNKNOWN_ERROR");
            order.order.transactionId = transaction._id;
            order.order.planId = plan.planId;
            return {order};
        } catch (err) {
            console.log("error in create order ");
            
            console.log(err);
            
            throw new Error(err.message);
        }
    }

    public async verifyPayment(userId: string,walletId: string,body: IVerifyPayment) {
        console.log("got verification of ",userId,walletId,body);
        try{
           
            const id = body.orderId + "|" + body.paymentId;
            
            const expectedSignature = crypto.createHmac("sha256", razorPaySecrets.secret)
            .update(id.toString())
            .digest("hex");
            console.log("sig received ", body.razorpay_signature);
            console.log("sig generated ", expectedSignature);
            const response = { signatureIsValid: false };
        if (expectedSignature === body.razorpay_signature) {
            const updatedTransaction: ITransactionModel  = await transactionModel.updateTransactionStatus(body.transactionId,ETransactionStatus.SUCCESS);
            console.log("Updated transaction is ",updatedTransaction);
            console.log("Updated transaction metadata is ",updatedTransaction.metaData,updatedTransaction.metaData.planId);

            if(updatedTransaction?.metaData && updatedTransaction?.metaData.get("planId") != EPLANS.PAYG){
                console.log("Plan payment verified ");
                const activatedPlan = await plansModel.activatePlan(userId,updatedTransaction.metaData.get("planId"),updatedTransaction._id);
                console.log(activatedPlan);
                
            }
            else
            {
                console.log("Wallet payment verified");
                
                const updatedWallet = await walletModel.addCreditToWallet(walletId,updatedTransaction.amount);
            }
            
            response.signatureIsValid = true;
            return response;
        }
        // console.log("returning ",response);
        
        return response;
    }catch(err){
        throw new HTTP401Error(err.message);
    }
}
}

export default new RazorPayModel();