/* eslint-disable @typescript-eslint/interface-name-prefix */
export interface IStripeProduct{
    name: string;
    active?: boolean;
    _id?: string;
    description?: string;
    metaData?: Record<string, any>;
}


export interface IStripePrice{
    unit_amount: number;
  currency: string;
  product: string;
  metaData?: Record<string, any>;
  active?: boolean;
  nickname?: string;
}