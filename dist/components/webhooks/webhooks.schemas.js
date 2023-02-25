"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookMessage = void 0;
const mongoose_1 = require("mongoose");
const message_interface_1 = require("../messages/message.interface");
const WebhookMessageSchema = new mongoose_1.Schema({
    message: {
        type: mongoose_1.Schema.Types.Mixed,
        required: true,
    },
    timestamp: {},
    name: {
        type: String
    },
    from: {
        type: String
    },
    status: {
        type: String,
        enum: Object.values(message_interface_1.EMessageStatus),
        default: message_interface_1.EMessageStatus.SENT
    },
    deviceId: {
        type: mongoose_1.Types.ObjectId,
        required: true,
        ref: "Device",
    },
    userId: {
        type: mongoose_1.Types.ObjectId,
        required: true,
        ref: "User",
    },
    urls: {
        type: [String],
        required: true,
    },
    reason: {
        type: String,
    },
}, {
    timestamps: true
});
exports.WebhookMessage = (0, mongoose_1.model)("WebhookMessage", WebhookMessageSchema);
exports.default = exports.WebhookMessage;
//# sourceMappingURL=webhooks.schemas.js.map