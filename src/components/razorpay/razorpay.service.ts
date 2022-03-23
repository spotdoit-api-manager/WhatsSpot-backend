import { razorPaySecrets } from './../../config/index';
import { ICreateOrder } from './razorpay.interface';
import Razorpay from 'razorpay';

export class RazorPayService{
    
    private readonly razorPyaInstance = new Razorpay({ key_id: razorPaySecrets.key, key_secret: razorPaySecrets.secret })

        public createOrder = (userId:string,createOrder:ICreateOrder)=>{
            return new Promise((resolve)=>{
                try{
                    console.log("creating order with ",createOrder,userId, razorPaySecrets.key,razorPaySecrets.secret);
                    
                    var options = {
                        amount: createOrder.amount*100,  // amount in the smallest currency unit
                        currency: "INR",
                        receipt: `receipt_${userId}`,
                        notes:{
                            planId:createOrder.planId,
                        }
                    };
                    this.razorPyaInstance.orders.create(options, function(err, order) {
                        if(err){
                            console.log(err);
                            resolve({error:true,message:err?.error?.description});
                        } 
                        console.log(order);
                        resolve({error:false,order});
                    });
                    console.log("created ");
                    
                }catch(err){
                    console.log(err);
                    
                    resolve({error:true,message:err.message})
                }
            })
        }
}

export default new RazorPayService()