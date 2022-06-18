import { Plan } from "./../../components/plans/plans.schema";
import { EPlanStatus } from "../../components/plans/plans.interface";
import { IUserPlan } from "../../components/plans/plans.interface";
import { UserPlan,IUserPlanModel } from "../../components/plans/plans.schema";
import logger from "../../core/logger";
import userModel from "../../components/user/user.model";
import notifyService from "./notify.service";
const EXPIRE_PLAN_CHECK_INTERVAL = 5;
const logFileName =  "[PlanMangerService]: ";
export class PlanManager{
    // constructor(){
    //     this.fetchExpiredPlans();
    // }

    // private async fetchExpiredPlans(){
    //     const now = new Date();        
    //     const expiredPlans: IUserPlanModel[]= await  UserPlan.find({endDate:{$lte:now},planStatus:EPlanStatus.ACTIVE});
    //     logger.info(logFileName,`FOUND ${expiredPlans.length} EXPIRED PLANS`);
    //     for(const plan of expiredPlans){
    //         const result = await this.expirePlan(plan._id);
    //     }
    //     setTimeout(() => {
    //         this.fetchExpiredPlans();
    //     },EXPIRE_PLAN_CHECK_INTERVAL*1000);
    // }

    public async expirePlan(plan: IUserPlanModel){
        const result = await UserPlan.findByIdAndUpdate(plan._id,{planStatus:EPlanStatus.EXPIRED});
        notifyService.planExpired(plan.userId,plan._id);
        await userModel.removeUserActivePlan(plan.userId,plan._id);
        logger.info(logFileName,`Plan ${plan._id} Expired`);
    }

    public async deletePlan(planId: string){
        const result= await Plan.findOneAndDelete(planId);
        return result;
    }
}

export default new PlanManager();