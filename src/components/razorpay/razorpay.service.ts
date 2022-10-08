import { ETransactionStatus } from "./../transaction/transaction.interface";

import { razorPaySecrets } from "./../../config/index";
import { ERazorPayOrderStatus, ICreateOrder } from "./razorpay.interface";
import Razorpay from "razorpay";
import userModel from "../user/user.model";
import walletModel from "../wallet/wallet.model";
import transactionModel from "../transaction/transaction.model";
import logger from "../../core/logger";
const CHK_TRX_STATUS_IN = 1; //In Minutes
const logFileName = "[RazorPayService]";
export class RazorPayService{
    
    private readonly razorPyaInstance = new Razorpay({ key_id: razorPaySecrets.key, key_secret: razorPaySecrets.secret })
  
    public async checkTransactionStatusIn(orderId: string,transactionId: string){
        setTimeout(async ()=>{
                try{
                    const razorPyaInstance = new Razorpay({ key_id: razorPaySecrets.key, key_secret: razorPaySecrets.secret });

                logger.info(logFileName,"Checking transaction status: ",transactionId);
                const order = await razorPyaInstance.orders.fetch(orderId);
                if(order && order.status==ERazorPayOrderStatus.CREATED){
                    logger.info(logFileName,"Transaction is still in created state,marking it as cancelled ");
                   transactionModel.updateTransactionStatus(transactionId,ETransactionStatus.CANCELLED);
                }else if(order && order.status==ERazorPayOrderStatus.ATTEMPTED){
                    logger.info(logFileName,"Transaction is in attempted state,marking it as error ");
                    transactionModel.updateTransactionStatus(transactionId,ETransactionStatus.ERROR);
                }else if(order && order.status==ERazorPayOrderStatus.PAID){
                    logger.info(logFileName,"Transaction is in paid state,marking it as success ");
                    //!TODO:can Add logic to check if user  activate plan is really activated 
                    transactionModel.updateTransactionStatus(transactionId,ETransactionStatus.SUCCESS);
                }
            }catch(err){
                logger.error(logFileName,`Error while checking transaction status: ${transactionId}`,err.message);
            }
            },CHK_TRX_STATUS_IN*60*1000);

        
    }
        public createOrder = (userId: string,createOrder: ICreateOrder)=>{
            return new Promise((resolve)=>{
                try{
                    console.log("creating order with ",createOrder,userId, razorPaySecrets.key,razorPaySecrets.secret);
                    
                    const options = {
                        amount: createOrder.amount*100,  // amount in the smallest currency unit
                        currency: "INR",
                        receipt: `receipt_${userId}`,
                        notes:{
                            planId:createOrder.planId,
                        }
                    };
                    this.razorPyaInstance.orders.create(options, (err, order)=>{
                        if(err){
                            console.log(err);
                            resolve({error:true,message:err?.error?.description});
                        } 
                        resolve({error:false,order});
                    });
                    console.log("created ");

                }catch(err){
                    console.log(err);
                    
                    resolve({error:true,message:err.message});
                }
            });
        }
}

export default new RazorPayService();

