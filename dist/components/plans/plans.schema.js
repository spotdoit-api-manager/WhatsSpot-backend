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
exports.UserPlan = exports.Plan = void 0;
const mongoose_1 = require("mongoose");
const planSchema = new mongoose_1.Schema({
    planId: {
        type: String,
        required: true
    },
    planName: {
        type: String,
        required: true
    },
    planAmount: {
        type: Number,
        required: true
    },
    stripePriceId: {
        type: String,
        required: true
    },
    planPeriod: {
        type: Number,
        required: true
    },
    planPeriodUnit: {
        type: String,
        required: true
    },
    planMaxMessage: {
        type: Number,
        required: true,
        default: 0
    },
    isBest: {
        type: Boolean,
        required: true,
        default: false
    },
    maxDevices: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true
});
planSchema.methods.addPlan = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return this.save();
    });
};
const userPlanSchema = new mongoose_1.Schema({
    userId: {
        required: true,
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: "User"
    },
    planName: {
        type: String,
        required: true
    },
    planInfo: {
        type: [String],
        required: true,
        default: []
    },
    planId: {
        type: String,
        required: true
    },
    planTransactionId: {
        required: true,
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: "Transaction"
    },
    sentMessageCount: {
        type: Number,
        required: true,
        default: 0
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    planStatus: {
        type: String,
        enum: ["ACTIVE", "EXPIRED", "EXHAUSTED"]
    }
}, { timestamps: true });
userPlanSchema.methods.savePlan = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return this.save();
    });
};
exports.Plan = mongoose_1.model("Plan", planSchema);
exports.UserPlan = mongoose_1.model("UserPlan", userPlanSchema);
//# sourceMappingURL=plans.schema.js.map