"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSerializedPhone = void 0;
exports.getSerializedPhone = (phone) => {
    phone = phone[0] === "+" ? phone.substr(1, phone.length) : phone;
    return `${phone}@s.whatsapp.net`;
};
//# sourceMappingURL=whatsapp-utils.js.map