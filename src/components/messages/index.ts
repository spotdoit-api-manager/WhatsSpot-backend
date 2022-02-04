import { validateTestMessageRequest } from './../testMessage/testMessage.middleware';
import { DeviceKeyValidator } from './../../lib/middleware/whatsapp.middleware';
import messageController from './message.controller';
export default [
    {
        path:"/message/addToQueue",
        method: "post",
        escapeAuth: true,
        handler: [DeviceKeyValidator, messageController.addToQueue]
    },
    {
        path:"/message/send/textMessage",
        method: "post",
        escapeAuth: true,
        handler: [DeviceKeyValidator, messageController.sendTextMessage]
    },
    {
        path:"/message/testMessage",
        method: "post",
        escapeAuth: true,
        handler: [validateTestMessageRequest,messageController.sendTestMessage]
    }
]