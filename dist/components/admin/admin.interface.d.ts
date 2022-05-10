export interface IAdminUser {
    phoneNumber: string;
    email: string;
    allowed: boolean;
    isSuperAdmin: boolean;
    otp?: string;
}
export interface IDataStoredInAdminToken {
    id: string;
}
