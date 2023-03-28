import configsController from "./configs.controller";

export default [
  
    {
        path:"/configs",
        method:"post",
        handler:[configsController.getConfigs],
        role:"admin"

    },
    {
        path:"/configs/update",
        method:"post",
        handler:[configsController.updateConfigs],
        role:"admin"
    }
];