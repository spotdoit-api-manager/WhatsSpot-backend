/* eslint-disable @typescript-eslint/interface-name-prefix */
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