
import { Document, model, Model, Mongoose, Schema, SchemaType, SchemaTypes } from "mongoose";
import { IUserPlan, IPLAN } from "./plans.interface";

export interface IPlanModel extends IPLAN, Document {
    addPlan(): any;
}

export interface IUserPlanModel extends IUserPlan, Document {
    savePlan(): any;
}


const planSchema = new Schema({
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
    maxDevices:{
        type: Number,
        required: true,
    }

}, {
    timestamps: true
});

planSchema.methods.addPlan = async function () {
    return this.save();
};


const userPlanSchema: Schema = new Schema({
    userId: {
        required: true,
        type: SchemaTypes.ObjectId,
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
        type: SchemaTypes.ObjectId,
        ref: "Transaction"
    },
    sentMessageCount: {
        type: Number,
        required: true,
        default: 0
    },
    webHookRequest:{
        type:Number,
        required:true,
        default:0
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

userPlanSchema.methods.savePlan = async function () {
    return this.save();
};

export const Plan: Model<IPlanModel> = model<IPlanModel>("Plan", planSchema);
export const UserPlan: Model<IUserPlanModel> = model<IUserPlanModel>("UserPlan", userPlanSchema);
