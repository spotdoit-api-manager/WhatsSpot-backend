import { IContact, IContactsGroup } from './contact.interface';
import { Document, Model } from "mongoose";
export interface IContactModel extends IContact, Document {
    saveContact(): any;
}
export interface IContactGroupModel extends IContactsGroup, Document {
    saveGroup(): any;
}
export declare const Contact: Model<IContactModel>;
export declare const ContactGroup: Model<IContactGroupModel>;
