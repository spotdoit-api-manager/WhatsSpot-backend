import { convertCurrency } from "./../../lib/services/exchange-rate.service";
import { HTTP400Error, HTTP401Error } from "./../../lib/utils/httpErrors";
import { ETransactionStatus, ETransactionTypes } from "./../transaction/transaction.interface";
import { ITransactionModel } from "./../transaction/transaction.schema";
import axios from "axios";
import logger from "../../core/logger";

import { EPLANS } from "../plans/plans.interface";
import transactionModel from "../transaction/transaction.model";
import plansModel from "../plans/plans.model";
import walletModel from "../wallet/wallet.model";
import userModel from "../user/user.model";
import { EPayWith } from "../../core/enums/pay-with.enum";
const logFileName = "PaypalModel";
export class PaytmModel {

 


    public async createOrder(userId: string,walletId: string,planId: EPLANS,amount: number,currency: string) {
      try{
          let finalAmount= null;
          let indianAmount =null;
        await userModel.checkIfUserCanActivatePlan(userId,planId);
        const plan = await plansModel.fetchPlanByPlanId(planId);

         if(planId===EPLANS.PAYG ){
            finalAmount = amount.toString();
            indianAmount=(await convertCurrency(currency,"INR",amount)); 
         }else{
            finalAmount=   (await convertCurrency("INR",currency,plan.planAmount)).toString(); 
            indianAmount = plan.planAmount;
            } 
        const transactionMessage = planId==EPLANS.PAYG? "Adding money to wallet" : `Buying ${plan.planName} subscription`;

        const payload = {
            intent: "CAPTURE",
            payment_data: {
                planId,
                userId,
                walletId
            },
            purchase_units: [{
                description: transactionMessage,
                userId: userId,
                amount: {
                    currency_code: currency,
                    value:finalAmount,
                    breakdown: {
                        item_total: {
                            currency_code:currency,
                            value: finalAmount
                        }
                    }
                },
                items: [{
                    name: "Enterprise Subscription",
                    quantity: "1",
                    category: "DIGITAL_GOODS",
                    unit_amount: {
                        currency_code: currency,
                        value: finalAmount,
                    },
                }]
            }]
        };
        const order = await this.createPaypalOrder(payload);
        const transaction: ITransactionModel = await transactionModel.createTransactionForPlan(plan.planId,order.id,userId,walletId,ETransactionTypes.CREDIT,indianAmount,transactionMessage,EPayWith.PAYPAL);
        return transaction;
      }catch(e){
        return {error:true,message:e.message};
      }
    }

    public async createPaypalOrder(order: any): Promise<any> {
        const token = await this.getPaypalToken();
        const url = `${process.env.PAYPAL_API_URL}/v2/checkout/orders`;
        const options = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        };
        const res = await axios.post(url, order, options);
        return res.data;
    }

    private async getPaypalToken(): Promise<string> {
        const url = `${process.env.PAYPAL_API_URL}/v1/oauth2/token`;
        const options = {
            auth: {
                username: process.env.PAYPAL_CLIENT_ID,
                password: process.env.PAYPAL_CLIENT_SECRET
            }
        };
        const res = await axios.post(url, new URLSearchParams({ grant_type: "client_credentials" }), options);
        return res.data.access_token;
    }

    private async getOrderDetails(orderId: string) {
        try{

            const url = `${process.env.PAYPAL_API_URL}/v2/checkout/orders/${orderId}`;
            const token = await this.getPaypalToken();

            const options = {
                headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        };
        const res = await axios.get(url, options);
        return res.data;
    }catch(e){
        logger.error(logFileName,e);
        throw new HTTP400Error(e.message);
    }
    }


    public async verifyOrder(userId: string,walletId: string,orderId: string,transactionId: string){
        const order = await this.getOrderDetails(orderId);
        const transaction = await transactionModel.fetchTransactionById(walletId,transactionId);
        if(!order)throw new HTTP400Error("ORDER_NOT_FOUND");
        if(!transaction) throw new HTTP400Error("UNKNOWN_ORDER");
        if(order.status!=="COMPLETED")throw new HTTP400Error("ORDER_NOT_COMPLETED");
        if(transaction.orderId!==orderId)throw new HTTP400Error("ORDER_NOT_MATCHED");
        if(transaction?.metaData && transaction?.metaData?.planId != EPLANS.PAYG){
            await plansModel.activatePlan(userId,transaction.metaData.planId,transaction._id);
        }
        else
        {                
           await walletModel.addCreditToWallet(walletId,transaction.amount);
        }
        const updatedTransaction = await transactionModel.updateTransactionStatus(transactionId,ETransactionStatus.SUCCESS);
        return updatedTransaction;
    }
}

export default new PaytmModel();