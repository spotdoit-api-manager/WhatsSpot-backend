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
exports.FastMessage = exports.MessageQueue = void 0;
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    to: {
        type: String,
        required: true,
    },
    message: String,
    sendType: {
        type: String,
        enum: ["FAST", "QUEUE"]
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
    contactsSent: [{
            phoneNumber: {
                type: String,
                required: true
            },
            status: {
                type: String,
                enum: ["SENT", "ERROR", "PENDING"]
            },
            reason: {
                type: String,
            }
        }]
}, {
    timestamps: true,
});
messageSchema.methods.addMessage = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return this.save();
    });
};
exports.MessageQueue = mongoose_1.model("MessageQueue", messageSchema);
exports.FastMessage = mongoose_1.model("FastMessage", messageSchema);
//# sourceMappingURL=message.schema.js.map