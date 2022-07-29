import { CountryCode } from "libphonenumber-js";
export interface IContact {
    name?: string;
    phoneNumber: string;
    country?: CountryCode;
}
export interface IContactsGroup {
    groupName: string;
    userId: string;
    contacts: IContact[];
}
export interface IGroupList {
    groupName: string;
    totalContacts: number;
    _id: string;
}
