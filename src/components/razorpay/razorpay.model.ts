import { ITransactionModel } from './../transaction/transaction.schema';
import { ETransactionStatus, ETransactionTypes } from '../transaction/transaction.interface';
import transactionModel from '../transaction/transaction.model';
import { razorPaySecrets } from './../../config/index';
import { HTTP401Error } from './../../lib/utils/httpErrors';
import { ICreateOrder, IVerifyPayment } from './razorpay.interface';
import razorpayService from './razorpay.service';
import walletModel from '../walllet/wallet.model';
import crypto from 'crypto';


export class RazorPayModel {
    public async createOrder(userId: string,walletId:string, body: ICreateOrder) {
        try {
            const order: any = await razorpayService.createOrder(userId, body);
            if (!order) throw new HTTP401Error("UNKNOWN_ERROR");
            console.log(order);
            if (order.error) throw new HTTP401Error(order.message);
            const transaction:ITransactionModel = await transactionModel.createTransaction(order.order.id,userId,walletId,ETransactionTypes.CREDIT,body.amount,"amount adding to wallet");
            if(!transaction) throw new HTTP401Error("UNKNOWN_ERROR");
            order.order.transactionId = transaction._id;
            return {order};
        } catch (err) {
            throw new HTTP401Error(err.message);
        }
    }

    public async verifyPayment(userId:string,walletId:string,body: IVerifyPayment) {
        console.log("got verification of ",userId,walletId,body);
        try{

            let id = body.orderId + "|" + body.paymentId;
            
            const expectedSignature = crypto.createHmac('sha256', razorPaySecrets.secret)
            .update(id.toString())
            .digest('hex');
            console.log("sig received ", body.razorpay_signature);
            console.log("sig generated ", expectedSignature);
            let response = { signatureIsValid: false };
        if (expectedSignature === body.razorpay_signature) {
            const updatedTransaction  = await transactionModel.updateTransactionStatus(body.transactionId,ETransactionStatus.SUCCESS);
            const updatedWallet = await walletModel.addCreditToWallet(walletId,updatedTransaction.amount);
            console.log(updatedTransaction,updatedWallet);
            
            response.signatureIsValid = true
            return response;
        }
        console.log("returning ",response);
        
        return response;
    }catch(err){
        throw new HTTP401Error(err.message);
    }
}
}

export default new RazorPayModel()