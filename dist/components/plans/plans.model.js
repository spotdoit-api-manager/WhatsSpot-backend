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
exports.PlansModel = void 0;
const plans_schema_1 = require("./plans.schema");
const plans_interface_1 = require("./plans.interface");
const httpErrors_1 = require("../../lib/utils/httpErrors");
const dayjs_1 = __importDefault(require("dayjs"));
const user_model_1 = __importDefault(require("../user/user.model"));
class PlansModel {
    fetchPlanById(planId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield plans_schema_1.Plan.findById(planId);
        });
    }
    fetchPlans() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield plans_schema_1.Plan.find({});
        });
    }
    fetchPlanByPlanId(planId) {
        return plans_schema_1.Plan.findOne({ planId }).lean();
    }
    addNewPlan(adminId, planBody) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("adding new plan");
            const newPlan = new plans_schema_1.Plan(planBody);
            const result = yield newPlan.addPlan();
            return result;
        });
    }
    updatePlan(adminId, planId, planUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            const plan = yield this.fetchPlanById(planId);
            if (!plan)
                throw new httpErrors_1.HTTP401Error("PLAN_NOT_FOUND");
            const result = yield plans_schema_1.Plan.findByIdAndUpdate(planId, planUpdate, { upsert: false, new: true });
        });
    }
    deletePlan(planId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield plans_schema_1.Plan.findOneAndDelete(planId);
            return result;
        });
    }
    activatePlan(userId, planId, planTransactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const plan = yield this.fetchPlanByPlanId(planId);
            if (!plan)
                throw new Error("INVALID_PLAN");
            const startDate = new Date();
            const endDate = yield this.calculatePlanEndDate(plan);
            const planBody = { planName: plan.planName, userId, planId, planTransactionId, startDate, endDate, sentMessageCount: 0, planStatus: plans_interface_1.EPlanStatus.ACTIVE };
            const newActivePlan = new plans_schema_1.UserPlan(planBody);
            const activatedPlan = yield newActivePlan.savePlan();
            yield user_model_1.default.addPlanToUser(userId, activatedPlan.planName, activatedPlan._id);
            return activatedPlan;
        });
    }
    calculatePlanEndDate(plan) {
        return __awaiter(this, void 0, void 0, function* () {
            let endDate = dayjs_1.default(new Date());
            if (plan.planId == plans_interface_1.EPLANS.PAYG) {
                return endDate.toDate();
            }
            else if (plan.planId == plans_interface_1.EPLANS.MEMBERSHIP || plan.planId == plans_interface_1.EPLANS.MONTHLY) {
                endDate.add(plan.planPeriod, plan.planPeriodUnit);
                return endDate.toDate();
            }
        });
    }
    validatePlanExpiry(planData) {
        return true;
    }
    increamentMessageCount(activePlanId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield plans_schema_1.UserPlan.findByIdAndUpdate(activePlanId, { $inc: { sentMessageCount: 1 } });
            return result;
        });
    }
}
exports.PlansModel = PlansModel;
exports.default = new PlansModel();
//# sourceMappingURL=plans.model.js.map