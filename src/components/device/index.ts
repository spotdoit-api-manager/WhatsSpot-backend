import { s3UploadMulter } from "../../lib/services/s3";
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
        path:"/device/auth/delete/:deviceId",
        method:"delete",
        escapeAuth:true,
        handler:[deviceController.deleteAuth]
    },
    {
        path:"/device/auth/logout/:deviceId",
        method:"get",
        escapeAuth:true,
        handler:[deviceController.logoutDevice]
    },
    {
        path:"/device/message/addMessageToQueue/:deviceId",
        method:"post",
        escapeAuth:true,
        handler:[deviceController.addMessageToQueue]
    },
    {
        path:"/device/send/textMessage/:deviceId",
        method:"post",
        escapeAuth:true,
        handler:[deviceController.sendTextMessage]
    },
    {
        path:"/device/send/imageMessage/:deviceId",
        method:"post",
        escapeAuth:true,
        handler:[s3UploadMulter.single('file'),deviceController.sendImageMessage]
    }
];