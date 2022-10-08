
export interface IAdminUser{
   phoneNumber: string;
   email: string;
   allowed: boolean;
   role: string;
   isSuperAdmin: boolean;
   otp?: string;
}

export interface IDataStoredInAdminToken{
    id: string;
}