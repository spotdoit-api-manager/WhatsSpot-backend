import { NextFunction, Request, Response } from "express";
import ResponseHandler from "../../lib/helpers/responseHandler";
import plansModel from "./plans.model";

export class PlansController{

    public addNewPlan = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        console.log("create new Plan");
        
        try {    
          responseHandler.reqRes(req, res).onFetch("PLAN_CREATED", await plansModel.addNewPlan(req.userId,req.body)).send();
        } catch (e) {
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };

      public updatePlan = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        console.log("create new Plan");
        
        try {    
          responseHandler.reqRes(req, res).onFetch("PLAN_UPDATED", await plansModel.updatePlan(req.userId,req.params.planId,req.body)).send();
        } catch (e) {
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };

      public fetchPlanById = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        console.log("create new Plan");
        
        try {    
          responseHandler.reqRes(req, res).onFetch("PLAN_FETCHED", await plansModel.fetchPlanById(req.params.planId)).send();
        } catch (e) {
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };

      public fetchPlans = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        console.log("create new Plan");
        
        try {    
          responseHandler.reqRes(req, res).onFetch("PLANS_FETCHED", await plansModel.fetchPlans()).send();
        } catch (e) {
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };
      public deletePlan = async (req: Request, res: Response, next: NextFunction) => {
        const responseHandler = new ResponseHandler();
        console.log("create new Plan");
        
        try {    
          responseHandler.reqRes(req, res).onFetch("PLAN_DELETED", await plansModel.deletePlan(req.params.planId)).send();
        } catch (e) {
          // send error with next function.
          next(responseHandler.sendError(e));
        }
      };

}

export default new PlansController();