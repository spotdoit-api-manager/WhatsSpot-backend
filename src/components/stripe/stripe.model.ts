/* eslint-disable @typescript-eslint/camelcase */
import { HTTP401Error } from "../../lib/utils/httpErrors";
import { commonConfig, stripeConfig } from "../../config";
import plansModel from "../plans/plans.model";
import { IPlanModel } from "../plans/plans.schema";
import { IStripePrice, IStripeProduct } from "./stripe.interface";
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


  public async createNewSession(userId: string, walletId: string, planId: string) {
    const plan: IPlanModel = await plansModel.fetchPlanByPlanId(planId);
    if(!plan)throw new HTTP401Error("INVALID_PLAN","The plan you have request doesnt exists");
    return await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${commonConfig.domain}/success`,
      cancel_url: `${commonConfig.domain}/cancel`,
    });
  }

  public async fetchSession(userId: string,sessionId: string){
    return await stripe.checkout.sessions.retrieve(
      sessionId
    );
  }

  public async expireSession(userId: string,sessionId: string){
    return await stripe.checkout.sessions.expire(sessionId);
  }

}

export default new StripePaymentModel();