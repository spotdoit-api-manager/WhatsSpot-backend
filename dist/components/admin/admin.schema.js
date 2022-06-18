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
exports.AdminUser = exports.AdminUserSchema = void 0;
/* eslint-disable @typescript-eslint/interface-name-prefix */
const mongoose_1 = require("mongoose");
exports.AdminUserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    isSuperAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    allowed: {
        type: Boolean,
        required: true,
        default: false
    },
    role: {
        type: String,
        required: true,
        default: "admin"
    }
}, {
    timestamps: true
});
exports.AdminUserSchema.methods.addNewAdmin = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return this.save();
    });
};
exports.AdminUser = mongoose_1.model("AdminUser", exports.AdminUserSchema);
//# sourceMappingURL=admin.schema.js.map