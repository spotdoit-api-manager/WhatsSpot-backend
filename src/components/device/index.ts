import deviceController from "./device.controller";

export default [
    {
        path:"/device/newDevice",
        method:"post",
        escapeAuth:true,
        handler:[deviceController.newDevice]
    },
    {
        path:"/device/getQr/:deviceId",
        method:"get",
        escapeAuth:true,
        handler:[deviceController.getQr]
    },
    {
        path:"/device/auth/:deviceId",
        method:"delete",
        escapeAuth:true,
        handler:[deviceController.deleteAuth]
    }
];