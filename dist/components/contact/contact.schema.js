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
exports.ContactGroup = exports.Contact = void 0;
const mongoose_1 = require("mongoose");
const contactSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: false
    }
}, {
    timestamps: true
});
contactSchema.methods.saveContact = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return this.save();
    });
};
const groupContactSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    }
}, { timestamps: true });
const groupSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "users"
    },
    groupName: {
        type: String,
        required: true
    },
    contacts: [groupContactSchema]
}, {
    timestamps: true
});
groupSchema.methods.saveGroup = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return this.save();
    });
};
exports.Contact = mongoose_1.model("Contact", contactSchema);
exports.ContactGroup = mongoose_1.model("ContactGroup", groupSchema);
//# sourceMappingURL=contact.schema.js.map