import { EPayWith } from "./../../core/enums/pay-with.enum";
import { EPLANS } from "./../plans/plans.interface";
import { ITransactionModel } from "./../transaction/transaction.schema";
import { ETransactionStatus, ETransactionTypes } from "./../transaction/transaction.interface";
/* eslint-disable @typescript-eslint/camelcase */
import { HTTP401Error } from "../../lib/utils/httpErrors";
import { commonConfig, stripeConfig } from "../../config";
import plansModel from "../plans/plans.model";
import { IPlanModel } from "../plans/plans.schema";
import { IStripePrice, IStripeProduct } from "./stripe.interface";
import transactionModel from "../transaction/transaction.model";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const stripe = require("stripe")(stripeConfig.secretKey);

export class StripePaymentModel {

  public async addProduct(productBody: IStripeProduct) {
    return await stripe.products.create(productBody);
  }

  public async getProducts(userId: string, limit: number = 10) {
    return await stripe.products.list({
      limit,
    });
  }

  public async createPrice(userId: string, priceBody: IStripePrice) {
    console.log("creating price ", priceBody);
    await stripe.prices.create(priceBody);
  }

  public async getPrices(userId: string, limit: number = 10) {
    return await stripe.prices.list({
      limit,
    });
  }


  public async createNewSession(userId: string, walletId: string,amount: number, planId: string) {
    const plan: IPlanModel = await plansModel.fetchPlanByPlanId(planId);
    if(!plan)throw new HTTP401Error("INVALID_PLAN","The plan you have request doesnt exists");
    const transaction: ITransactionModel = await transactionModel.createTransactionForPlan(planId,"STRIPE",userId,walletId,ETransactionTypes.CREDIT,plan.planAmount,plan.planName,EPayWith.STRIPE);
    if(!transaction) throw new HTTP401Error("UNKNOWN_ERROR","Unable to create transaction");
    
    const  session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: plan.stripePriceId,
          quantity: planId==EPLANS.PAYG?amount:1,
        },
      ],
      mode: "payment",
      metadata:{
        userId:userId.toString(),
        planId:planId.toString(),
        transactionId:transaction._id.toString()
      },
      success_url: `${commonConfig.domain}/user/wallet`,
      cancel_url: `${commonConfig.domain}/user/wallet`,
    });
    return {sessionId:session.id,sessionUrl:session.url,amount:session.amount_total,expiresAt:session.expires_at};
  }

  public async validateSession(userId: string,walletId: string,sessionId: string){
  const session =   await stripe.checkout.sessions.retrieve(
      sessionId
    );
    if(session.metadata.userId!==userId.toString()) throw new HTTP401Error("INVALID_SESSION","The session you are trying to validate is not valid");
      const transaction = await transactionModel.fetchTransactionById(walletId,session.metadata.transactionId);
      if(transaction.status!==ETransactionStatus.PENDING)throw new HTTP401Error("INVALID_SESSION","The session you are trying to validate is already credited");
    await plansModel.activatePlan(userId,session.metadata.planId,transaction._id);                
    transactionModel.updateTransactionStatus(session.metadata.transactionId,ETransactionStatus.SUCCESS);
  }
  public async fetchSession(userId: string,sessionId: string){
    return await stripe.checkout.sessions.retrieve(
      sessionId
    );
  }

  public async expireSession(userId: string,sessionId: string){
    return await stripe.checkout.sessions.expire(sessionId);
  }

  public stripeEvent(body: any){
    console.log("stripe event",body);
  }

}

export default new StripePaymentModel();