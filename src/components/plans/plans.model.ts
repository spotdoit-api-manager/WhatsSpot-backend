import notifyService from "../../lib/services/notify.service";
import { ETransactionTypes,ETransactionStatus } from "./../transaction/transaction.interface";
import { ITransactionModel } from "./../transaction/transaction.schema";
import {  IPlanModel, IUserPlanModel, Plan, UserPlan } from "./plans.schema";
import { EPLANS, EPlanStatus, IPLAN, IUserPlan } from "./plans.interface";
import { HTTP401Error } from "../../lib/utils/httpErrors";
import dayjs from "dayjs";
import userModel from "../user/user.model";
import planManagerService from "../../lib/services/plan.manager.service";
import transactionModel from "../transaction/transaction.model";
import adminModel from "../admin/admin.model";
import logger from "../../lib/utils/logger";
import { EPayWith } from "../../core/enums/pay-with.enum";

const logFileName ="[PlanModel] : ";
export class PlansModel{

public async fetchPlanById(planId: string){
    return await Plan.findById(planId);
}
public async fetchPlans(){
    return await Plan.find({});
}

public fetchPlanByPlanId(planId: string){
    return Plan.findOne({planId}).lean();
}

public async addNewPlan(adminId: string,planBody: IPLAN){
    console.log("adding new plan");
    const newPlan: IPlanModel= new Plan(planBody);
   const result =  await newPlan.addPlan();
   return result;
}

public async updatePlan(adminId: string,planId: string,planUpdate: any){
    const plan: IPlanModel = await this.fetchPlanById(planId);
    if(!plan) throw new HTTP401Error("PLAN_NOT_FOUND");
    const result = await Plan.findByIdAndUpdate(planId,planUpdate,{upsert:false,new:true});
}

public async activateUserPlan(adminId: string,userId: string,planId: string,reason: string="Admin Activated "){//by admin
    if(planId == EPLANS.PAYG)throw new HTTP401Error("PAYG_PLAN_NOT_ALLOWED");
    await adminModel.isSuperAdmin(adminId);
    const userActivePlan = await userModel.fetchUserActivePlan(userId);
    if(userActivePlan && userActivePlan.planStatus === EPlanStatus.ACTIVE){
        throw new HTTP401Error("ALREADY_HAS_ACTIVE_PLAN","User already has an active plan");
    }else if(userActivePlan && userActivePlan.planStatus === EPlanStatus.EXHAUSTED){
        await userModel.removeUserActivePlan(userId,userActivePlan._id);
    }
    const user = await userModel.fetch(userId);
    const plan: IPLAN = await this.fetchPlanByPlanId(planId);
    const transactionMessage = `${reason}-> ${plan.planName}`;
    const transaction: ITransactionModel = await transactionModel.createTransactionForPlan(plan.planId,`ADMIN_${adminId}`,userId,user.walletId,ETransactionTypes.CREDIT,plan.planAmount,transactionMessage,EPayWith.ADMIN);
    const activePlan: IUserPlan = await this.activatePlan(userId,planId,transaction._id);
    const updatedTransaction: ITransactionModel  = await transactionModel.updateTransactionStatus(transaction._id,ETransactionStatus.SUCCESS);
    return activePlan;
}


public async deletePlan(planId: string){
  return await planManagerService.deletePlan(planId);
}

public async activatePlan(userId: string,planId: string,planTransactionId: string){
    const plan: IPLAN = await this.fetchPlanByPlanId(planId);
    if(!plan) throw new Error("INVALID_PLAN"); 
    const startDate = new Date();
    const endDate = await this.calculatePlanEndDate(plan);
    const planBody: IUserPlan = {planName:plan.planName,userId,planId,planTransactionId,startDate,endDate,sentMessageCount:0,planStatus:EPlanStatus.ACTIVE};
    const newActivePlan: IUserPlanModel = new UserPlan(planBody);
    const activatedPlan: IUserPlanModel = await newActivePlan.savePlan();
    await userModel.addPlanToUser(userId,activatedPlan.planName,activatedPlan._id);
    return activatedPlan;
}

private async calculatePlanEndDate(plan: IPLAN){
    console.log(plan);
   let endDate = dayjs(new Date());
   if(plan.planId==EPLANS.PAYG){
       return endDate.toDate();
    }
    else{
       endDate = endDate.add(plan.planPeriod,plan.planPeriodUnit);
       console.log(`End Date: ${endDate.toDate()}`);
       return endDate.toDate();
   }
}

public validatePlanExpiry(planData: IUserPlan){
    return true;
}

private async exhaustActivePlan(userPlanId: string){
    logger.info(`Exhausting active plan ${userPlanId}`);
    const activePlanStats = await UserPlan.findByIdAndUpdate(userPlanId,{planStatus:EPlanStatus.EXHAUSTED},{new:true}).select("sentMessageCount planStatus userId planId");
    notifyService.planExhausted(activePlanStats.userId,userPlanId);
    return activePlanStats;
}
public async expirePlan(plan: IUserPlanModel){
    logger.info(logFileName,`Expiring user plan ${plan._id}`);
    const result = await UserPlan.findByIdAndUpdate(plan._id,{planStatus:EPlanStatus.EXPIRED});
    notifyService.planExpired(plan.userId,plan._id);
    await userModel.removeUserActivePlan(plan.userId,plan._id);
    logger.info(logFileName,`Plan ${plan._id} Expired`);
}

public async increamentMessageCount(activePlanId: string){
    const activePlanStats = await UserPlan.findByIdAndUpdate(activePlanId,{$inc:{sentMessageCount:1}},{new:true}).select("sentMessageCount planId");
    const planInfo = await Plan.findOne({planId:activePlanStats.planId}).select("planMaxMessage").lean();
    if(Number(planInfo.planMaxMessage) && Number(activePlanStats.sentMessageCount)>=Number(planInfo.planMaxMessage)){
        await this.exhaustActivePlan(activePlanId);
    }
    return activePlanStats;
}





}

export default new PlansModel();