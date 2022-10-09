import { HTTP401Error } from "./../../lib/utils/httpErrors";
import { AdminUser } from "./admin.schema";
export class AdminUtils{
    public async isSuperAdmin(adminId: string): Promise<boolean> {
        const adminUser = await AdminUser.findById(adminId);
        if (!adminUser) throw new HTTP401Error("OPERATION_NOT_ALLOWED", "Only Super Admins can make Admin User Super Admin");
        if (adminUser.isSuperAdmin) {
            return true;
        }
        return false;
    }

}


export default new AdminUtils();