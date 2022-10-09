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
exports.AdminUtils = void 0;
const httpErrors_1 = require("./../../lib/utils/httpErrors");
const admin_schema_1 = require("./admin.schema");
class AdminUtils {
    isSuperAdmin(adminId) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminUser = yield admin_schema_1.AdminUser.findById(adminId);
            if (!adminUser)
                throw new httpErrors_1.HTTP401Error("OPERATION_NOT_ALLOWED", "Only Super Admins can make Admin User Super Admin");
            if (adminUser.isSuperAdmin) {
                return true;
            }
            return false;
        });
    }
}
exports.AdminUtils = AdminUtils;
exports.default = new AdminUtils();
//# sourceMappingURL=admin.utils.js.map