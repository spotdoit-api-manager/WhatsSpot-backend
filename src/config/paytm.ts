import { commonConfig } from "./index";
export default  {
  MID: "lkOKVl96202761689282",
  PAYTM_MERCHANT_KEY: "#E7HNOrVupPbqSin",
  PAYTM_FINAL_URL: "https://securegw-stage.paytm.in/theia/processTransaction",
  WEBSITE: "WEBSTAGING",
  CHANNEL_ID: "WAP",
  INDUSTRY_TYPE_ID: "Retail",
  CALLBACK_URL: `${commonConfig.backendUrl}/paytm/response`,
  CALLBACK_URL_ADD: "https://securegw-stage.paytm.in/theia/paytmCallback",
  TRANSACTION_STATUS_URL:"https://securegw-stage.paytm.in/order/status",
  PORT: 3000
};
  