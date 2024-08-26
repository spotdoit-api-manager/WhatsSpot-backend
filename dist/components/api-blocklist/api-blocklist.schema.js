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
exports.ApiBlockList = void 0;
/* eslint-disable @typescript-eslint/interface-name-prefix */
const mongoose_1 = require("mongoose");
const apiBlockListSchema = new mongoose_1.Schema({
    token: {
        type: String,
        required: true
    },
    deviceId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Device"
    },
    createdOn: {
        type: Date,
        required: true,
    },
    expiresOn: {
        type: Date,
        required: true,
    },
    blockedOn: {
        type: Date,
        required: true,
        default: new Date()
    }
}, { timestamps: true });
apiBlockListSchema.methods.addToList = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return this.save();
    });
};
exports.ApiBlockList = (0, mongoose_1.model)("api-block-list", apiBlockListSchema);
//# sourceMappingURL=api-blocklist.schema.js.map