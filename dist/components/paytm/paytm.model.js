"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const httpErrors_1 = require("./../../lib/utils/httpErrors");
const paytm_helper_1 = __importDefault(require("./paytm.helper"));
const mongoose_1 = require("mongoose");
const axios_1 = __importDefault(require("axios"));
const paytm_helper_2 = __importDefault(require("./paytm.helper"));
const paytm_1 = __importDefault(require("../../config/paytm"));
const plans_model_1 = __importDefault(require("../plans/plans.model"));
const plans_interface_1 = require("../plans/plans.interface");
const user_model_1 = __importDefault(require("../user/user.model"));
const transaction_model_1 = __importDefault(require("../transaction/transaction.model"));
const logger_1 = __importDefault(require("../../core/logger"));
const transaction_interface_1 = require("../transaction/transaction.interface");
const pay_with_enum_1 = require("../../core/enums/pay-with.enum");
const logFileName = "[PaytmModel] : ";
class PaytmModel {
    updateTransactionInformation(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.connection.startSession();
            try {
                yield session.withTransaction(() => __awaiter(this, void 0, void 0, function* () {
                    // const t = await Transaction.findOneAndUpdate({ _id: transaction.ORDERID }, { $set: { "status": transaction.STATUS, "metadata.sessionId": transaction.TXNID, "metadata.mode": transaction.PAYMENTMODE, "metadata.gateway": transaction.GATEWAYNAME } }, { new: true }).session(session);
                    if (transaction.STATUS == "TXN_SUCCESS") {
                        // const w = await 
                        console.log("Paytm transaction success");
                    }
                    else {
                        console.log("Pytm transaction failed");
                        // const w = await Wallet.findById(t.walletId);                
                    }
                })).then(() => __awaiter(this, void 0, void 0, function* () {
                    session.endSession();
                }));
            }
            catch (e) {
                console.log(e);
                throw new httpErrors_1.HTTP400Error(e);
            }
        });
    }
    checkTransactionStatus(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // let response = await Axios.post(config.TRANSACTION_STATUS_URL, body);
                // console.log(paytmConfig.TRANSACTION_STATUS_URL);
                console.log(body);
                const response = yield axios_1.default({
                    method: "POST",
                    url: paytm_1.default.TRANSACTION_STATUS_URL,
                    data: Object.assign({}, body)
                });
                console.log("check transaction response" + response.data);
                yield this.updateTransactionInformation(response.data);
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e);
            }
        });
    }
    responseFromPaytm(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("body is" + body);
                const response = yield this.responsePayment(body);
                console.log("response is" + response);
                yield this.checkTransactionStatus(body);
                return paytm_helper_2.default.responseHTMLRender(response);
            }
            catch (e) {
                console.log("error is ", e);
                throw new httpErrors_1.HTTP400Error(e);
            }
        });
    }
    initiatePaytmTransaction(userId, walletId, planId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(logFileName, planId, amount);
            const plan = yield plans_model_1.default.fetchPlanByPlanId(planId);
            yield user_model_1.default.checkIfUserCanActivatePlan(userId, planId);
            if (planId != plans_interface_1.EPLANS.PAYG)
                amount = plan.planAmount;
            const transactionMessage = plan.planId == plans_interface_1.EPLANS.PAYG ? "Adding money to wallet" : `Buying plan -> ${plan.planName}`;
            const transaction = yield transaction_model_1.default.createTransactionForPlan(plan.planId, "PAYTM", userId, walletId, transaction_interface_1.ETransactionTypes.CREDIT, amount, transactionMessage, pay_with_enum_1.EPayWith.PAYTM);
            return yield this.payWithPaytm(userId, walletId, transaction._id, planId, amount);
        });
    }
    payWithPaytm(userId, walletId, transactionId, planId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const success = yield this.initPayment(`${userId}`, walletId, `${transactionId}`, planId, `${amount}`);
                return paytm_helper_1.default.paymentHTMLRender(paytm_1.default.PAYTM_FINAL_URL, success);
            }
            catch (e) {
                throw new httpErrors_1.HTTP400Error(e);
            }
        });
    }
    initPayment(userId, walletId, transactionId, planId, amount) {
        return new Promise((resolve, reject) => {
            const paymentObj = {
                ORDER_ID: transactionId,
                userInfo: {
                    userId,
                    walletId,
                    planId
                },
                INDUSTRY_TYPE_ID: paytm_1.default.INDUSTRY_TYPE_ID,
                CHANNEL_ID: paytm_1.default.CHANNEL_ID,
                TXN_AMOUNT: amount.toString(),
                MID: paytm_1.default.MID,
                WEBSITE: paytm_1.default.WEBSITE,
                CALLBACK_URL: paytm_1.default.CALLBACK_URL
            };
            console.log("Sedning Request to Paytm : ", paytm_1.default.PAYTM_MERCHANT_KEY);
            paytm_helper_1.default.genchecksum(paymentObj, paytm_1.default.PAYTM_MERCHANT_KEY, (err, result) => {
                if (err) {
                    return reject("Error while generating checksum");
                }
                else {
                    paymentObj.CHECKSUMHASH = result;
                    return resolve(paymentObj);
                }
            });
        });
    }
    ;
    responsePayment(paymentObject) {
        console.log("Response Paytm :", paytm_1.default.PAYTM_MERCHANT_KEY);
        return new Promise((resolve, reject) => {
            if (paytm_helper_1.default.verifychecksum(paymentObject, paytm_1.default.PAYTM_MERCHANT_KEY, paymentObject.CHECKSUMHASH)) {
                resolve(paymentObject);
            }
            else {
                return reject("Error while verifying checksum");
            }
        });
    }
    ;
}
exports.default = new PaytmModel();
//# sourceMappingURL=paytm.model.js.map