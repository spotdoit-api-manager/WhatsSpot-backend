import { NextFunction, Request, Response } from "express";
export declare class PlansController {
    addNewPlan: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updatePlan: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    fetchPlanById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    fetchPlans: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deletePlan: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: PlansController;
export default _default;
