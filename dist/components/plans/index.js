"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const plans_controller_1 = __importDefault(require("./plans.controller"));
exports.default = [
    {
        path: "/plans/addNewPlan",
        method: "post",
        role: "admin",
        handler: [plans_controller_1.default.addNewPlan]
    },
    {
        path: "/plans/updatePlan/:planId",
        method: "post",
        role: "admin",
        handler: [plans_controller_1.default.updatePlan]
    },
    {
        path: "/plans/deletePlan/:planId",
        method: "delete",
        role: "admin",
        handler: [plans_controller_1.default.deletePlan]
    },
    {
        path: "/plans/fetchPlan/planId",
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