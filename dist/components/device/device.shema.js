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
exports.Device = void 0;
const mongoose_1 = require("mongoose");
const utils_1 = require("../../lib/utils");
const deviceSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: "string",
        required: true,
        validate: [utils_1.validateMobile, "invalid phone number"],
    },
}, {
    timestamps: true,
});
deviceSchema.methods.saveDevice = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return this.save();
    });
};
exports.Device = mongoose_1.model("Device", deviceSchema);
//# sourceMappingURL=device.shema.js.map