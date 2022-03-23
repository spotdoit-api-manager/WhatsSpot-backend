import {  IPlanModel, IUserPlanModel, Plan, UserPlan } from "./plans.schema";
import { EPLANS, EPlanStatus, IPLAN, IUserPlan } from "./plans.interface";
import { HTTP401Error } from "../../lib/utils/httpErrors";
import dayjs from "dayjs";
import userModel from "../user/user.model";

export class PlansModel{

public async fetchPlanById(planId:string){
    return await Plan.findById(planId);
}
public async fetchPlans(){
    return await Plan.find({});
}

public fetchPlanByPlanId(planId:string){
    return Plan.findOne({planId}).lean();
}

public async addNewPlan(adminId:string,planBody:IPLAN){
    console.log("adding new plan");
    const newPlan:IPlanModel= new Plan(planBody);
   const result =  await newPlan.addPlan();
   return result;
}

public async updatePlan(adminId:string,planId:string,planUpdate:any){
    const plan:IPlanModel = await this.fetchPlanById(planId);
    if(!plan) throw new HTTP401Error("PLAN_NOT_FOUND");
    const result = await Plan.findByIdAndUpdate(planId,planUpdate,{upsert:false,new:true});
}


public async deletePlan(planId:string){
    const result= await Plan.findOneAndDelete(planId);
    return result;
}

public async activatePlan(userId:string,planId:string,planTransactionId:string){
    const plan:IPLAN = await this.fetchPlanByPlanId(planId);
    if(!plan) throw new Error("INVALID_PLAN"); 
    const startDate = new Date();
    const endDate = await this.calculatePlanEndDate(plan);
    const planBody:IUserPlan = {planName:plan.planName,userId,planId,planTransactionId,startDate,endDate,sentMessageCount:0,planStatus:EPlanStatus.ACTIVE};
    const newActivePlan:IUserPlanModel = new UserPlan(planBody);
    const activatedPlan:IUserPlanModel = await newActivePlan.savePlan();
    await userModel.addPlanToUser(userId,activatedPlan.planName,activatedPlan._id);
    return activatedPlan;
}

private async calculatePlanEndDate(plan:IPLAN){
   let endDate =dayjs(new Date());
   if(plan.planId==EPLANS.PAYG){
       return endDate.toDate();
    }
    else if(plan.planId == EPLANS.MEMBERSHIP || plan.planId==EPLANS.MONTHLY){
       endDate.add(plan.planPeriod,plan.planPeriodUnit);
       return endDate.toDate();
   }
}

public validatePlanExpiry(planData:IUserPlan){
    return true;
}

public async increamentMessageCount(activePlanId:string){
    const result = await UserPlan.findByIdAndUpdate(activePlanId,{$inc:{sentMessageCount:1}});
    return result;
}



}

export default new PlansModel()