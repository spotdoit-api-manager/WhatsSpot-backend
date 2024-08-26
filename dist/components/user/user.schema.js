"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.User = exports.UserSchema = void 0;
const mongoose_1 = require("mongoose");
const bcrypt = __importStar(require("bcryptjs"));
const planRef = new mongoose_1.Schema({
    planName: {
        type: String,
        required: true
    },
    planRef: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: "UserPlan",
        required: true
    }
}, { timestamps: true });
const NotificationChannels = new mongoose_1.Schema({
    email: {
        type: Boolean,
        default: false
    },
    whatsapp: {
        type: Boolean,
        default: true
    },
    sms: {
        type: Boolean,
        default: true
    }
}, { timestamps: false, _id: false });
const UserSettingsSchema = new mongoose_1.Schema({
    notifications: {
        device: {
            type: NotificationChannels,
            required: true
        },
        plan: {
            type: NotificationChannels,
            required: true
        },
    }
}, { timestamps: false, _id: false });
exports.UserSchema = new mongoose_1.Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        select: false,
        unique: true,
        sparse: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    activePlans: [planRef],
    previousPlans: [planRef],
    walletId: {
        required: true,
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: "wallet",
        immutable: true
    },
    dateOfBirth: Date,
    role: {
        type: String,
        enum: ["user", "admin"],
        required: true,
        description: "user"
    },
    phone: {
        type: String,
        minlength: 3,
        unique: true,
        required: true
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
    },
    otp: Number,
    emailOtp: Number,
    deviceCodes: {
        type: mongoose_1.SchemaTypes.Mixed,
        required: false,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    deactivation: {
        type: Boolean,
        default: false
    },
    tokens: [String],
    hints: {
        type: Number,
        default: 0
    },
    avatar: {
        type: String
    },
    country: {
        type: String,
        required: true
    },
    emailVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    settings: {
        type: UserSettingsSchema,
        required: true,
        default: {
            notifications: {
                device: {
                    email: false,
                    whatsapp: true,
                    sms: true
                },
                plan: {
                    email: false,
                    whatsapp: true,
                    sms: true,
                }
            }
        },
    }
}, {
    timestamps: true
});
exports.UserSchema.methods.addNewUser = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return this.save();
    });
};
exports.UserSchema.methods.correctPassword = function (candidatePassword, userPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt.compare(candidatePassword, userPassword);
    });
};
exports.User = (0, mongoose_1.model)("User", exports.UserSchema);
//# sourceMappingURL=user.schema.js.map