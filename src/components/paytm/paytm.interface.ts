import { EPLANS } from "./../plans/plans.interface";
/* eslint-disable @typescript-eslint/interface-name-prefix */
export interface IPaytmPaymentObject {
    ORDER_ID: string;
    // CUST_ID: string;
    INDUSTRY_TYPE_ID: string;
    CHANNEL_ID: string;
    TXN_AMOUNT: string;
    MID: string;
    WEBSITE: string;
    CALLBACK_URL: string;
    CHECKSUMHASH?: string;
    userInfo: {
        userId: string;
        walletId: string;
        planId: EPLANS;
    };

}
