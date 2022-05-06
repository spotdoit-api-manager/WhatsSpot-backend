import { IUserPlanModel } from "../../components/plans/plans.schema";
export declare class PlanManager {
    constructor();
    private fetchExpiredPlans;
    expirePlan(plan: IUserPlanModel): Promise<void>;
    deletePlan(planId: string): Promise<import("../../components/plans/plans.schema").IPlanModel>;
}
declare const _default: PlanManager;
export default _default;
