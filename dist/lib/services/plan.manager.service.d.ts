import { IUserPlanModel } from "../../components/plans/plans.schema";
export declare class PlanManager {
    expirePlan(plan: IUserPlanModel): Promise<void>;
    deletePlan(planId: string): Promise<import("./../../components/plans/plans.schema").IPlanModel>;
    hasActivePlan(userId: string): Promise<{
        hasActivePlan: boolean;
        isMessageOver: boolean;
        activePlanInfo: IUserPlanModel;
    } | {
        hasActivePlan: boolean;
        isMessageOver?: undefined;
        activePlanInfo?: undefined;
    }>;
}
declare const _default: PlanManager;
export default _default;
