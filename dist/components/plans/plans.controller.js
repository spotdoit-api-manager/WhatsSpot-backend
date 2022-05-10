"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlansController = void 0;
const responseHandler_1 = __importDefault(require("../../lib/helpers/responseHandler"));
const plans_model_1 = __importDefault(require("./plans.model"));
class PlansController {
    constructor() {
        this.addNewPlan = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            console.log("create new Plan");
            try {
                responseHandler.reqRes(req, res).onFetch("PLAN_CREATED", yield plans_model_1.default.addNewPlan(req.userId, req.body)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.updatePlan = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            console.log("create new Plan");
            try {
                responseHandler.reqRes(req, res).onFetch("PLAN_UPDATED", yield plans_model_1.default.updatePlan(req.userId, req.params.planId, req.body)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.fetchPlanById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            console.log("create new Plan");
            try {
                responseHandler.reqRes(req, res).onFetch("PLAN_FETCHED", yield plans_model_1.default.fetchPlanById(req.params.planId)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.fetchPlans = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            console.log("create new Plan");
            try {
                responseHandler.reqRes(req, res).onFetch("PLANS_FETCHED", yield plans_model_1.default.fetchPlans()).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.deletePlan = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            console.log("create new Plan");
            try {
                responseHandler.reqRes(req, res).onFetch("PLAN_DELETED", yield plans_model_1.default.deletePlan(req.params.planId)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
    }
}
exports.PlansController = PlansController;
exports.default = new PlansController();
//# sourceMappingURL=plans.controller.js.map