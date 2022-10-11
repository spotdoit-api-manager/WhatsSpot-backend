import { validateTestMessageRequest } from "./../testMessage/testMessage.middleware";
import { DeviceKeyValidator } from "../../lib/middleware/device-key.middleware";
import messageController from "./message.controller";
import { validateTextMessage,validateListMessage,validateBtnMessage,validateTemplateMessage, validateImageBtnMessage } from "../../lib/middleware/message.middleware";
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
    {
        path:"/message/template",
        method: "post",
        escapeAuth: true,
        
        handler: [DeviceKeyValidator,validateTemplateMessage, messageController.queueTemplateMessage]
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
        path:"/message/fast/template",
        method: "post",
        escapeAuth: true,
        
        handler: [DeviceKeyValidator,validateTemplateMessage, messageController.fastTemplate]
    },
    {
        path:"/message/fast/image-buttons",
        method: "post",
        escapeAuth: true,
        
        handler: [DeviceKeyValidator,validateImageBtnMessage, messageController.fastImageBtn]
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