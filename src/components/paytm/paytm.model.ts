import { IPaytmPaymentObject } from "./paytm.interface";
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { HTTP400Error, HTTP401Error } from "./../../lib/utils/httpErrors";
import PaymentHelper from "./paytm.helper";
import { connection } from "mongoose";
import Axios from "axios";
import paytmHelper from "./paytm.helper";
import { ITransactionModel, Transaction } from "../transaction/transaction.schema";
import paytmConfig from "../../config/paytm";
import plansModel from "../plans/plans.model";
import { EPLANS, EPlanStatus, IPLAN } from "../plans/plans.interface";
import userModel from "../user/user.model";
import transactionModel from "../transaction/transaction.model";
import logger from "../../core/logger";
import { IPlanModel } from "../plans/plans.schema";
import { ETransactionTypes } from "../transaction/transaction.interface";
const logFileName = "[PaytmModel] : ";

class PaytmModel {

  

    private async updateTransactionInformation(transaction: any) {
        const session = await connection.startSession();
        try {
            await session.withTransaction(async () => {
                // const t = await Transaction.findOneAndUpdate({ _id: transaction.ORDERID }, { $set: { "status": transaction.STATUS, "metadata.sessionId": transaction.TXNID, "metadata.mode": transaction.PAYMENTMODE, "metadata.gateway": transaction.GATEWAYNAME } }, { new: true }).session(session);
                if (transaction.STATUS == "TXN_SUCCESS") {
                    // const w = await 
                    console.log("Paytm transaction success");

                } else {
                    console.log("Pytm transaction failed");
                    // const w = await Wallet.findById(t.walletId);                
                }
            }).then(async () => {
                session.endSession();
            });
        } catch (e) {
            console.log(e);
            throw new HTTP400Error(e);
        }
    }

    private async checkTransactionStatus(body: any) {
        try {
            // let response = await Axios.post(config.TRANSACTION_STATUS_URL, body);
            // console.log(paytmConfig.TRANSACTION_STATUS_URL);
            console.log(body);
            const response = await Axios({
                method: "POST",
                url: paytmConfig.TRANSACTION_STATUS_URL,
                data: {
                    ...body
                }
            });
            console.log("check transaction response" + response.data);
            await this.updateTransactionInformation(response.data);
        } catch (e) {
            throw new HTTP400Error(e);
        }
    }

    public async responseFromPaytm(body: any) {
        try {
            console.log("body is" + body);
            const response = await this.responsePayment(body);
            console.log("response is" + response);
            await this.checkTransactionStatus(body);
            return paytmHelper.responseHTMLRender(response);
        } catch (e) {
            console.log("error is ", e);
            throw new HTTP400Error(e);
        }
    }

    public async initiatePaytmTransaction(userId: string, walletId: string, planId: EPLANS, amount: number) {
        logger.info(logFileName, planId, amount);
        const plan: IPlanModel = await plansModel.fetchPlanByPlanId(planId);
        await userModel.checkIfUserCanActivatePlan(userId, planId);
        if(planId!=EPLANS.PAYG)amount=plan.planAmount;
        const transactionMessage = plan.planId == EPLANS.PAYG ? "Adding money to wallet" : `Buying plan -> ${plan.planName}`;
        const transaction: ITransactionModel = await transactionModel.createTransactionForPlan(plan.planId, "PAYTM", userId, walletId, ETransactionTypes.CREDIT, amount, transactionMessage);

        return await this.payWithPaytm(userId,walletId, transaction._id,planId, amount);


    }

    private async payWithPaytm(userId: string,walletId: string, transactionId: string,planId: EPLANS, amount: number) {
        try {
            const success = await this.initPayment(`${userId}`,walletId, `${transactionId}`,planId, `${amount}`);
            return PaymentHelper.paymentHTMLRender(paytmConfig.PAYTM_FINAL_URL, success);
        } catch (e) {
            throw new HTTP400Error(e);
        }
    }


    private initPayment(userId: string,walletId: string, transactionId: string,planId: EPLANS, amount: string) {
        return new Promise((resolve, reject) => {
            const paymentObj: IPaytmPaymentObject = {
                ORDER_ID: transactionId,
                userInfo:{
                   userId,
                   walletId,
                   planId
                },
                INDUSTRY_TYPE_ID: paytmConfig.INDUSTRY_TYPE_ID,
                CHANNEL_ID: paytmConfig.CHANNEL_ID,
                TXN_AMOUNT: amount.toString(),
                MID: paytmConfig.MID,
                WEBSITE: paytmConfig.WEBSITE,
                CALLBACK_URL: paytmConfig.CALLBACK_URL
            };
            console.log("Sedning Request to Paytm : ", paytmConfig.PAYTM_MERCHANT_KEY);
            PaymentHelper.genchecksum(
                paymentObj,
                paytmConfig.PAYTM_MERCHANT_KEY,
                (err: any, result: any) => {
                    if (err) {
                        return reject("Error while generating checksum");
                    } else {
                        paymentObj.CHECKSUMHASH = result;
                        return resolve(paymentObj);
                    }
                }
            );
        });
    };

    private responsePayment(paymentObject: IPaytmPaymentObject) {
        console.log("Response Paytm :", paytmConfig.PAYTM_MERCHANT_KEY);
        return new Promise((resolve, reject) => {
            if (
                PaymentHelper.verifychecksum(
                    paymentObject,
                    paytmConfig.PAYTM_MERCHANT_KEY,
                    paymentObject.CHECKSUMHASH!
                )
            ) {
                resolve(paymentObject);
            } else {
                return reject("Error while verifying checksum");
            }
        });
    };

}

export default new PaytmModel();
