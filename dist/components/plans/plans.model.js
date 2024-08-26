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
const notify_service_1 = __importDefault(require("../../lib/services/notify.service"));
const transaction_interface_1 = require("./../transaction/transaction.interface");
const plans_schema_1 = require("./plans.schema");
const plans_interface_1 = require("./plans.interface");
const httpErrors_1 = require("../../lib/utils/httpErrors");
const dayjs_1 = __importDefault(require("dayjs"));
const user_model_1 = __importDefault(require("../user/user.model"));
const plan_manager_service_1 = __importDefault(require("../../lib/services/plan.manager.service"));
const transaction_model_1 = __importDefault(require("../transaction/transaction.model"));
const admin_model_1 = __importDefault(require("../admin/admin.model"));
const logger_1 = __importDefault(require("../../lib/utils/logger"));
const pay_with_enum_1 = require("../../core/enums/pay-with.enum");
const logFileName = "[PlanModel] : ";
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
    activateUserPlan(adminId, userId, planId, reason = "Admin Activated ") {
        return __awaiter(this, void 0, void 0, function* () {
            if (planId == plans_interface_1.EPLANS.PAYG)
                throw new httpErrors_1.HTTP401Error("PAYG_PLAN_NOT_ALLOWED");
            yield admin_model_1.default.isSuperAdmin(adminId);
            const userActivePlan = yield user_model_1.default.fetchUserActivePlan(userId);
            if (userActivePlan && userActivePlan.planStatus === plans_interface_1.EPlanStatus.ACTIVE) {
                throw new httpErrors_1.HTTP401Error("ALREADY_HAS_ACTIVE_PLAN", "User already has an active plan");
            }
            else if (userActivePlan && userActivePlan.planStatus === plans_interface_1.EPlanStatus.EXHAUSTED) {
                yield user_model_1.default.removeUserActivePlan(userId, userActivePlan._id);
            }
            const user = yield user_model_1.default.fetch(userId);
            const plan = yield this.fetchPlanByPlanId(planId);
            const transactionMessage = `${reason}-> ${plan.planName}`;
            const transaction = yield transaction_model_1.default.createTransactionForPlan(plan.planId, `ADMIN_${adminId}`, userId, user.walletId, transaction_interface_1.ETransactionTypes.CREDIT, plan.planAmount, transactionMessage, pay_with_enum_1.EPayWith.ADMIN);
            const activePlan = yield this.activatePlan(userId, planId, transaction._id);
            const updatedTransaction = yield transaction_model_1.default.updateTransactionStatus(transaction._id, transaction_interface_1.ETransactionStatus.SUCCESS);
            return activePlan;
        });
    }
    deletePlan(planId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield plan_manager_service_1.default.deletePlan(planId);
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
            console.log(plan);
            let endDate = (0, dayjs_1.default)(new Date());
            if (plan.planId == plans_interface_1.EPLANS.PAYG) {
                return endDate.toDate();
            }
            else {
                endDate = endDate.add(plan.planPeriod, plan.planPeriodUnit);
                console.log(`End Date: ${endDate.toDate()}`);
                return endDate.toDate();
            }
        });
    }
    validatePlanExpiry(planData) {
        return true;
    }
    exhaustActivePlan(userPlanId) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(`Exhausting active plan ${userPlanId}`);
            const activePlanStats = yield plans_schema_1.UserPlan.findByIdAndUpdate(userPlanId, { planStatus: plans_interface_1.EPlanStatus.EXHAUSTED }, { new: true }).select("sentMessageCount planStatus userId planId");
            notify_service_1.default.planExhausted(activePlanStats.userId, userPlanId);
            return activePlanStats;
        });
    }
    expirePlan(plan) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(logFileName, `Expiring user plan ${plan._id}`);
            const result = yield plans_schema_1.UserPlan.findByIdAndUpdate(plan._id, { planStatus: plans_interface_1.EPlanStatus.EXPIRED });
            notify_service_1.default.planExpired(plan.userId, plan._id);
            yield user_model_1.default.removeUserActivePlan(plan.userId, plan._id);
            logger_1.default.info(logFileName, `Plan ${plan._id} Expired`);
        });
    }
    increamentMessageCount(activePlanId) {
        return __awaiter(this, void 0, void 0, function* () {
            const activePlanStats = yield plans_schema_1.UserPlan.findByIdAndUpdate(activePlanId, { $inc: { sentMessageCount: 1 } }, { new: true }).select("sentMessageCount planId");
            const planInfo = yield plans_schema_1.Plan.findOne({ planId: activePlanStats.planId }).select("planMaxMessage").lean();
            if (Number(planInfo.planMaxMessage) && Number(activePlanStats.sentMessageCount) >= Number(planInfo.planMaxMessage)) {
                yield this.exhaustActivePlan(activePlanId);
            }
            return activePlanStats;
        });
    }
}
exports.PlansModel = PlansModel;
exports.default = new PlansModel();
//# sourceMappingURL=plans.model.js.map