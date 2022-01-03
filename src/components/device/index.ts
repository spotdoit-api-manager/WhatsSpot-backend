import deviceController from "./device.controller";

export default [
    {
        path:"/device/newDevice",
        method:"post",
        escapeAuth:true,
        handler:[deviceController.newDevice]
    },
    {
        path:"/device/getQr/:phone",
        method:"get",
        escapeAuth:true,
        handler:[deviceController.getQr]
    }
];