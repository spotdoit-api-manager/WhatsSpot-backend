"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EDeviceStatus = exports.EApiKeyStatus = void 0;
var EApiKeyStatus;
(function (EApiKeyStatus) {
    EApiKeyStatus["ACTIVE"] = "ACTIVE";
    EApiKeyStatus["INACTIVE"] = "INACTIVE";
    EApiKeyStatus["EXPIRED"] = "EXPIRED";
})(EApiKeyStatus = exports.EApiKeyStatus || (exports.EApiKeyStatus = {}));
var EDeviceStatus;
(function (EDeviceStatus) {
    EDeviceStatus["SENDING"] = "SENDING";
    EDeviceStatus["IDLE"] = "IDLE";
})(EDeviceStatus = exports.EDeviceStatus || (exports.EDeviceStatus = {}));
// const data = {
//     "structuredQuery": {
//         "from": [{ "collectionId": "messages" }],
//         "orderBy": [
//             {
//                 "field": {
//                     "fieldPath": "submitedOn"
//                 },
//                 "direction": "ASCENDING"
//             }
//         ]
//     }
// };
//# sourceMappingURL=device.interface.js.map