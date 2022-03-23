import { Document, Model } from "mongoose";
import { IUserPlan, IPLAN } from './plans.interface';
export interface IPlanModel extends IPLAN, Document {
    addPlan(): any;
}
export interface IUserPlanModel extends IUserPlan, Document {
    savePlan(): any;
}
export declare const Plan: Model<IPlanModel>;
export declare const UserPlan: Model<IUserPlanModel>;
