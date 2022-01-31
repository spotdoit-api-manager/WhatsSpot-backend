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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserSchema = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.UserSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        minlength: 2,
    },
    lastName: {
        type: String,
        minlength: 2,
    },
    username: {
        type: String,
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        select: false,
        unique: true,
        sparse: true
    },
    email: {
        type: String,
        unique: false,
        required: true
    },
    walletId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: "wallet",
        immutable: true
    },
    dateOfBirth: Date,
    role: {
        type: String,
        enum: ["user", "admin"],
        required: true
    },
    facebookId: {
        type: String
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
        return yield bcrypt_1.default.compare(candidatePassword, userPassword);
    });
};
exports.User = mongoose_1.model("User", exports.UserSchema);
//# sourceMappingURL=user.schema.js.map