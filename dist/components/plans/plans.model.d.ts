/// <reference types="mongoose" />
import { IPlanModel, IUserPlanModel } from "./plans.schema";
import { IPLAN, IUserPlan } from "./plans.interface";
export declare class PlansModel {
    fetchPlanById(planId: string): Promise<IPlanModel>;
    fetchPlans(): Promise<IPlanModel[]>;
    fetchPlanByPlanId(planId: string): import("mongoose").Query<any>;
    addNewPlan(adminId: string, planBody: IPLAN): Promise<any>;
    updatePlan(adminId: string, planId: string, planUpdate: any): Promise<void>;
    activateUserPlan(adminId: string, userId: string, planId: string, reason?: string): Promise<IUserPlan>;
    deletePlan(planId: string): Promise<IPlanModel>;
    activatePlan(userId: string, planId: string, planTransactionId: string): Promise<IUserPlanModel>;
    private calculatePlanEndDate;
    validatePlanExpiry(planData: IUserPlan): boolean;
    private exhaustActivePlan;
    expirePlan(plan: IUserPlanModel): Promise<void>;
    increamentMessageCount(activePlanId: string): Promise<IUserPlanModel>;
}
declare const _default: PlansModel;
export default _default;
