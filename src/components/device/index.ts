import { DeviceKeyValidator } from './../../lib/middleware/whatsapp.middleware';
import { s3UploadMulter } from "../../lib/services/s3";
import deviceController from "./device.controller";

export default [
    {
        path: "/device/newDevice",
        method: "post",
        handler: [deviceController.newDevice]
    },
    {
        path: "/device/:deviceId/fetch",
        method: "get",
        handler: [deviceController.fetchDevice]
    }, {
        path: "/device/fetchAll",
        method: "get",
        handler: [deviceController.fetchAllDevices]
    },

    {
        path: "/device/getQr/:deviceId",
        method: "get",
        escapeAuth: true,
        handler: [deviceController.getQr]
    },
    {
        path: "/device/auth/delete/:deviceId",
        method: "delete",
        escapeAuth: true,
        handler: [deviceController.deleteAuth]
    },
    {
        path: "/device/auth/logout/:deviceId",
        method: "get",
        escapeAuth: true,
        handler: [deviceController.logoutDevice]
    },
    {
        path: "/device/:deviceId/keys/generate",
        method: "post",
        escapeAuth: true,
        handler: [deviceController.generateNewKey]
    },
    {
        path: "/device/:deviceId/keys",
        method: "get",
        escapeAuth: false,
        handler: [deviceController.getKeys]
    },
    {
        path: "/device/message/addMessageToQueue/:deviceId",
        method: "post",
        escapeAuth: true,
        handler: [deviceController.addMessageToQueue]
    },
    {
        path: "/device/send/textMessage",
        method: "post",
        escapeAuth: false,
        handler: [DeviceKeyValidator, deviceController.sendTextMessage]
    },

    {
        path: "/device/send/imageMessage/:deviceId",
        method: "post",
        escapeAuth: true,
        handler: [s3UploadMulter.single('file'), deviceController.sendImageMessage]
    }
];