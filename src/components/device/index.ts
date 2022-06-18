import { DeviceKeyValidator } from "../../lib/middleware/device-key.middleware";
import { s3UploadMulter } from "../../lib/services/s3";
import deviceController from "./device.controller";

export default [
    {
        path: "/device/newDevice/:code/add",
        method: "post",
        handler: [deviceController.newDevice]
    },
    {
        path: "/device/newDevice/code",
        method: "post",
        handler: [deviceController.newDeviceCode]
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
        path: "/device/:deviceId/metrics",
        method: "get",
        handler: [deviceController.fetchDeviceMetrics]
    },

    {
        path: "/device/getQr/:deviceId",
        method: "get",
        escapeAuth: false,
        handler: [deviceController.getQr]
    },
    
    {
        path: "/device/removeClient/:deviceId",
        method: "get",
        escapeAuth: false,
        handler: [deviceController.removeClient]
    },
    {
        path: "/device/auth/delete/:deviceId",
        method: "delete",
        escapeAuth: false,
        handler: [deviceController.deleteAuth]
    },
    {
        path: "/device/auth/logout/:deviceId",
        method: "get",
        escapeAuth: false,
        handler: [deviceController.logoutDevice]
    },
    {
        path: "/device/:deviceId/keys/generate",
        method: "post",
        escapeAuth: false,
        handler: [deviceController.generateNewKey]
    },
    {
        path: "/device/:deviceId/keys",
        method: "get",
        escapeAuth: false,
        handler: [deviceController.getKeys]
    },
    {
        path: "/device/:deviceId/keys/delete/:keyId",
        method: "delete",
        escapeAuth: false,
        handler: [deviceController.deleteKey]
    },
    {
        path: "/device/:deviceId/message/addMessageToQueue", //send by device id
        method: "post",
        escapeAuth: false,
        handler: [deviceController.addMessageToQueue]
    },
    {
        path: "/device/:deviceId/retryFailed", //send failed message
        method: "post",
        escapeAuth: false,
        handler: [deviceController.retryFailedMessage]
    },
 
    {
        path: "/device/:deviceId/send/textMessage",
        method: "post",
        escapeAuth: false,
        handler: [deviceController.sendTextMessage]
    },

    {
        path: "/device/send/imageMessage/:deviceId",
        method: "post",
        escapeAuth: true,
        handler: [s3UploadMulter.single("file"), deviceController.sendImageMessage]
    },
    {
        path: "/device/:deviceId/prevMessages",
        method: "get",
        escapeAuth: false,
        handler: [deviceController.fetchPrevMessages]
    },
    {
        path: "/device/removeDevice/:deviceId",
        method: "delete",
        handler: [deviceController.removeDevice]
    },
    {
        path: "/device/:deviceId/status",
        method: "get",
        handler: [deviceController.getDeviceStatus]
    },
];