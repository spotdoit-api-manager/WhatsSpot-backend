import { validateTestMessageRequest } from "./../testMessage/testMessage.middleware";
import { DeviceKeyValidator } from "../../lib/middleware/device-key.middleware";
import messageController from "./message.controller";
import { validateTextMessage,validateListMessage,validateBtnMessage } from "../../lib/middleware/message.middleware";
export default [

    //queue message
    {
        path:"/message/text",
        method: "post",
        escapeAuth: true,
        handler: [DeviceKeyValidator,validateTextMessage, messageController.queueTextMessage]
    },
    {
        path:"/message/list",
        method: "post",
        escapeAuth: true,
        handler: [DeviceKeyValidator,validateListMessage, messageController.queueListMessage]
    },
    {
        path:"/message/button",
        method: "post",
        escapeAuth: true,
        handler: [DeviceKeyValidator,validateBtnMessage, messageController.queueBtnMessage]
    },
    // fast messages
    {
        path:"/message/fast/text",
        method: "post",
        escapeAuth: true,
        handler: [DeviceKeyValidator,validateTextMessage, messageController.fastText]
    },
    {
        path:"/message/fast/list",
        method: "post",
        escapeAuth: true,
        handler: [DeviceKeyValidator,validateListMessage, messageController.fastList]
    },
    {
        path:"/message/fast/button",
        method: "post",
        escapeAuth: true,
        handler: [DeviceKeyValidator,validateBtnMessage, messageController.fastBtn]
    },
   
    {
        path:"/message/testMessage",
        method: "post",
        escapeAuth: true,
        handler: [validateTestMessageRequest,messageController.sendTestMessage]
    },
    {
        path:"/message/rawMessage",
        method: "post",
        escapeAuth: true,
        handler: [messageController.sendRawMessage]
    }
];