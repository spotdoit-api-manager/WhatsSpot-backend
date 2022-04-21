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
exports.PlanManager = void 0;
const plans_schema_1 = require("./../../components/plans/plans.schema");
const plans_interface_1 = require("../../components/plans/plans.interface");
const plans_schema_2 = require("../../components/plans/plans.schema");
const logger_1 = __importDefault(require("../../core/logger"));
const EXPIRE_PLAN_CHECK_INTERVAL = 5;
const logFileName = "[PlanMangerService]: ";
class PlanManager {
    constructor() {
        this.fetchExpiredPlans();
    }
    fetchExpiredPlans() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const expiredPlans = yield plans_schema_2.UserPlan.find({ endDate: { $lte: now }, planStatus: plans_interface_1.EPlanStatus.ACTIVE });
            logger_1.default.info(logFileName, `FOUND ${expiredPlans.length} EXPIRED PLANS`);
            for (const plan of expiredPlans) {
                const result = yield this.expirePlan(plan._id);
            }
            setTimeout(() => {
                this.fetchExpiredPlans();
            }, EXPIRE_PLAN_CHECK_INTERVAL * 1000);
        });
    }
    expirePlan(plan) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield plans_schema_2.UserPlan.findByIdAndUpdate(plan._id, { planStatus: plans_interface_1.EPlanStatus.EXPIRED });
            logger_1.default.info(logFileName, `Plan ${plan._id} Expired`);
        });
    }
    deletePlan(planId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield plans_schema_1.Plan.findOneAndDelete(planId);
            return result;
        });
    }
}
exports.PlanManager = PlanManager;
exports.default = new PlanManager();
//# sourceMappingURL=plan.manager.service.js.map