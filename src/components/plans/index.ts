import plansController from "./plans.controller";

export default [
    {
        path:"/plans/addNewPlan",
        method:"post",
        role:"admin",
        handler: [plansController.addNewPlan]
    },
    {
        path:"/plans/updatePlan/:planId",
        method:"post",
        role:"admin",

        handler: [plansController.updatePlan]
    },
    {
        path:"/plans/deletePlan/:planId",
        method:"delete",
        role:"admin",
        handler: [plansController.deletePlan]
    },
    {
        path:"/plans/fetchPlan/planId",
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