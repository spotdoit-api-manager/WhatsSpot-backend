"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const plans_controller_1 = __importDefault(require("./plans.controller"));
exports.default = [
    {
        path: "/admin/plans/addNewPlan",
        method: "post",
        role: "admin",
        handler: [plans_controller_1.default.addNewPlan]
    },
    {
        path: "/admin/plans/updatePlan/:planId",
        method: "patch",
        role: "admin",
        handler: [plans_controller_1.default.updatePlan]
    },
    {
        path: "/admin/plan/activate/:userId/:planId",
        method: "post",
        role: "admin",
        handler: [plans_controller_1.default.activateUserPlan]
    },
    {
        path: "/admin/plans/deletePlan/:planId",
        method: "delete",
        role: "admin",
        handler: [plans_controller_1.default.deletePlan]
    },
    {
        path: "/plans/fetchPlan/:planId",
        method: "get",
        escapeAuth: true,
        handler: [plans_controller_1.default.fetchPlanById]
    },
    {
        path: "/plans/fetchPlans",
        method: "get",
        escapeAuth: true,
        handler: [plans_controller_1.default.fetchPlans]
    },
];
//# sourceMappingURL=index.js.map