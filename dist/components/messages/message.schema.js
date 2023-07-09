"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FastMessage = exports.MessageQueue = exports.ScheduleMessage = void 0;
const whatsapp_enum_1 = require("./../../lib/services/whatsapp/whatsapp.enum");
const message_interface_1 = require("./message.interface");
const mongoose_1 = require("mongoose");
const contactSentSchema = new mongoose_1.Schema({
    phoneNumber: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ["SENT", "ERROR", "PENDING"]
    },
    reason: {
        type: String,
    }
}, { timestamps: true });
const whatsappTextMessageSchema = new mongoose_1.Schema({
    text: {
        type: String,
        required: true
    }
});
const whatsappListMessageSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    footer: {
        type: String,
        required: true,
    },
    buttonText: {
        type: String,
        required: true,
    },
    sections: [
        { title: {
                type: String,
                required: true,
            },
            rows: [{
                    title: {
                        type: String,
                        required: true,
                    },
                    rowId: {
                        type: String,
                        required: true,
                    },
                    description: {
                        type: String,
                        required: false,
                    },
                }]
        }
    ]
});
const messageSchema = new mongoose_1.Schema({
    priority: {
        type: Number,
        required: true,
        default: 0
    },
    to: {
        type: String,
        required: true,
    },
    messageType: {
        type: String,
        enum: Object.values(whatsapp_enum_1.EWhatsappMessageTypes),
    },
    message: {
        type: mongoose_1.Schema.Types.Mixed,
    },
    sendType: {
        type: String,
        enum: Object.values(message_interface_1.ESendType),
    },
    phone: String,
    status: {
        type: String,
        enum: ["SENT", "ERROR", "PENDING"]
    },
    reason: {
        type: String,
        required: false
    },
    deviceId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: "device"
    },
    userId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: "user"
    },
    expand: {
        type: Boolean,
        default: false
    },
    isGroup: {
        type: Boolean,
        default: false
    },
    contactsSent: [contactSentSchema],
    scheduleTime: {
        type: Date,
        required: false
    },
    messageGap: {
        type: Number,
        required: false,
        default: 10
    }
}, {
    timestamps: true,
});
messageSchema.methods.addMessage = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return this.save();
    });
};
exports.ScheduleMessage = (0, mongoose_1.model)("ScheduleMessage", messageSchema);
exports.MessageQueue = (0, mongoose_1.model)("MessageQueue", messageSchema);
exports.FastMessage = (0, mongoose_1.model)("FastMessage", messageSchema);
//# sourceMappingURL=message.schema.js.map