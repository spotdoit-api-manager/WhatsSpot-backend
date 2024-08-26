"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EPlanStatus = exports.EPLANS = void 0;
var EPLANS;
(function (EPLANS) {
    EPLANS["PAYG"] = "PAYG";
    EPLANS["MONTHLY"] = "MONTHLY";
    EPLANS["SUBSCRIPTION"] = "SUBSCRIPTION";
    EPLANS["PREMIUM"] = "PREMIUM";
    EPLANS["MEMBERSHIP"] = "MEMBERSHIP"; // 6 month unlimited
})(EPLANS = exports.EPLANS || (exports.EPLANS = {}));
var EPlanStatus;
(function (EPlanStatus) {
    EPlanStatus["ACTIVE"] = "ACTIVE";
    EPlanStatus["EXPIRED"] = "EXPIRED";
    EPlanStatus["EXHAUSTED"] = "EXHAUSTED";
})(EPlanStatus = exports.EPlanStatus || (exports.EPlanStatus = {}));
//# sourceMappingURL=plans.interface.js.map