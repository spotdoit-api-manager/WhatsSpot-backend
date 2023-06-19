/// <reference types="mongoose" />
import { IContact, IContactsGroup } from "./contact.interface";
import { IContactModel, IContactGroupModel } from "./contact.schema";
export declare class ContactModal {
    addNewContacts(userId: string, contacts: IContact[]): Promise<IContactModel[]>;
    private createNewContact;
    fetchContacts(userId: string): Promise<any[]>;
    fetchGroupContacts(userId: string, groupId: string): Promise<any>;
    addContactsToGroup(userId: string, groupId: string, contacts: IContact[]): Promise<import("mongoose").LeanDocument<IContactGroupModel>>;
    fetchGroups(userId: string): Promise<any[]>;
    createNewGroup(userId: string, groupName: string, contacts?: IContactsGroup[]): IContactGroupModel;
    deleteGroup(user: string, groupId: string): Promise<IContactGroupModel>;
    editContacts(userId: string, contacts: IContactModel[]): Promise<any[]>;
    editGroupContacts(userId: string, groupId: string, contacts: IContactModel[]): Promise<{
        message: string;
    }>;
    deleteContacts(userId: string, contactsId: string[]): Promise<any>;
    deleteGroupContacts(userId: string, groupId: string, contactsId: string[]): Promise<any[]>;
}
declare const _default: ContactModal;
export default _default;
