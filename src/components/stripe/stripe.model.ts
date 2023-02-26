/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { EPayWith } from "./../../core/enums/pay-with.enum";
import { EPLANS } from "./../plans/plans.interface";
import { ITransactionModel } from "./../transaction/transaction.schema";
import { ETransactionStatus, ETransactionTypes } from "./../transaction/transaction.interface";

import { HTTP401Error } from "../../lib/utils/httpErrors";
import { commonConfig, stripeConfig } from "../../config";
import plansModel from "../plans/plans.model";
import { IPlanModel } from "../plans/plans.schema";
import { IStripePrice, IStripeProduct } from "./stripe.interface";
import transactionModel from "../transaction/transaction.model";
import walletModel from "../wallet/wallet.model";
import userModel from "../user/user.model";
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


  public async createNewSession(userId: string, walletId: string, amount: number, planId: string) {
    const plan: IPlanModel = await plansModel.fetchPlanByPlanId(planId);
    if (!plan) throw new HTTP401Error("INVALID_PLAN", "The plan you have request doesn't exists");
    const user = await userModel.getUserById(userId);
    const finalAmount = planId === EPLANS.PAYG ? amount : plan.planAmount;
    const currency = user.country === "IN" ? "INR" : "USD";
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          // currency,
          price: plan.stripePriceId,
          quantity: planId == EPLANS.PAYG ? amount : 1,
        },
      ],
      mode: "payment",
      metadata: {
        userId: userId.toString(),
        planId: planId.toString(),
      },
      success_url: `${commonConfig.domain}/user/wallet`,
      cancel_url: `${commonConfig.domain}/user/wallet`,
    }).catch((err) => {
      console.log("error creating session", err);
      throw new HTTP401Error("STRIPE_SESSION_ERROR", err.message);
    });

    const transaction: ITransactionModel = await transactionModel.createTransactionForPlan(planId, session.id, userId, walletId, ETransactionTypes.CREDIT, finalAmount, plan.planName, EPayWith.STRIPE);
    if (!transaction) throw new HTTP401Error("UNKNOWN_ERROR", "Unable to create transaction");
    return { sessionId: session.id, sessionUrl: session.url, amount: session.amount_total, expiresAt: session.expires_at };
  }

  public async validateSession(userId: string, walletId: string, sessionId: string) {
    const session = await stripe.checkout.sessions.retrieve(
      sessionId
    );
    if (session.metadata.userId !== userId.toString()) throw new HTTP401Error("INVALID_SESSION", "The session you are trying to validate is not valid");
    const transaction = await transactionModel.fetchTransactionById(walletId, session.metadata.transactionId);
    if (transaction.status !== ETransactionStatus.PENDING) throw new HTTP401Error("INVALID_SESSION", "The session you are trying to validate is already credited");
    await plansModel.activatePlan(userId, session.metadata.planId, transaction._id);
    transactionModel.updateTransactionStatus(session.metadata.transactionId, ETransactionStatus.SUCCESS);
  }
  public async fetchSession(userId: string, sessionId: string) {
    return await stripe.checkout.sessions.retrieve(
      sessionId
    );
  }

  public async expireSession(userId: string, sessionId: string) {
    return await stripe.checkout.sessions.expire(sessionId);
  }

  public stripeEvent(event: any) {
    // console.log("stripe event",body);
    
    switch (event.type) {
      case "checkout.session.completed":
        this.sessionSucceed(event);
        break;
      case "checkout.session.canceled":
        this.sessionCancelled(event);
        break;
      case "checkout.session.payment_failed":
        this.sessionFailed(event);
        break;
      case "checkout.session.expired":
        this.sessionExpired(event);

      default:
        console.log("unknown event", event.type);

    }
  }

  private async sessionSucceed(event: any) {
    const session = event.data.object;
   
    const ordinalSession = await this.fetchSession(session.metadata.userId, session.id);
    if (!ordinalSession) throw new HTTP401Error("INVALID_SESSION", "The session you are trying to validate is not valid");
    const transaction: ITransactionModel = await transactionModel.fetchTransactionByOrderId(session.id);
   
    if (transaction.status !== ETransactionStatus.PENDING) throw new HTTP401Error("INVALID_SESSION", "The session you are trying to validate is already validated");
    if (transaction.metaData.planId === EPLANS.PAYG) {
      await walletModel.addBalanceToWallet(transaction.userId,transaction.walletId, transaction.amount);
    } else {
      await plansModel.activatePlan(session.metadata.userId, session.metadata.planId, transaction._id);
    }
    transactionModel.updateTransactionStatus(transaction._id, ETransactionStatus.SUCCESS);
  }
  private async sessionFailed(event: any) {
    const session = event.data.object;
    console.log("session failed", session.id);
    const transaction = await transactionModel.fetchTransactionByOrderId(session.id);
    transactionModel.updateTransactionStatus(transaction._id, ETransactionStatus.ERROR);
  }
  private async sessionCancelled(event: any) {
    const session = event.data.object;

    console.log("session cancelled", event.id);
    const transaction = await transactionModel.fetchTransactionByOrderId(session.id);
    transactionModel.updateTransactionStatus(transaction._id, ETransactionStatus.CANCELLED);

  }

  private async sessionExpired(event: any) {
    const session = event.data.object;

    console.log("session expired", event.id);
    const transaction = await transactionModel.fetchTransactionByOrderId(session.id);
    transactionModel.updateTransactionStatus(transaction._id, ETransactionStatus.EXPIRED);
  }

  public validateSignature(body: any, sig: any, secret: string) {
    return stripe.webhooks.constructEvent(body, sig, secret);
  }


}

export default new StripePaymentModel();