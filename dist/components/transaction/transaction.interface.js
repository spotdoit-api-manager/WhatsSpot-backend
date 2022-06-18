"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ETransactionStatus = exports.ETransactionTypes = void 0;
var ETransactionTypes;
(function (ETransactionTypes) {
    ETransactionTypes["CREDIT"] = "CREDIT";
    ETransactionTypes["DEBIT"] = "DEBIT";
})(ETransactionTypes = exports.ETransactionTypes || (exports.ETransactionTypes = {}));
var ETransactionStatus;
(function (ETransactionStatus) {
    ETransactionStatus["ERROR"] = "ERROR";
    ETransactionStatus["PENDING"] = "PENDING";
    ETransactionStatus["SUCCESS"] = "SUCCESS";
    ETransactionStatus["EXPIRED"] = "EXPIRED";
    ETransactionStatus["CANCELLED"] = "CANCELLED";
})(ETransactionStatus = exports.ETransactionStatus || (exports.ETransactionStatus = {}));
//# sourceMappingURL=transaction.interface.js.map