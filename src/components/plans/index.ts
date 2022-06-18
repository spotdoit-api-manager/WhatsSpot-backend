import plansController from "./plans.controller";

export default [
    {
        path:"/admin/plans/addNewPlan",
        method:"post",
        role:"admin",
        handler: [plansController.addNewPlan]
    },
    {
        path:"/admin/plans/updatePlan/:planId",
        method:"patch",
        role:"admin",
        handler: [plansController.updatePlan]
    },
    {
        path:"/admin/plan/activate/:userId/:planId",
        method:"post",
        role:"admin",
        handler: [plansController.activateUserPlan]
    },
    {
        path:"/admin/plans/deletePlan/:planId",
        method:"delete",
        role:"admin",
        handler: [plansController.deletePlan]
    },
    {
        path:"/plans/fetchPlan/:planId",
        method:"get",
        escapeAuth:true,
        handler: [plansController.fetchPlanById]
    },
    {
        path:"/plans/fetchPlans",
        method:"get",
        escapeAuth:true,
        handler: [plansController.fetchPlans]
    },
    
];