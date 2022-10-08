
import { IContact, IContactsGroup } from "./contact.interface";
import { Document, model, Model, Schema, SchemaType } from "mongoose";

export interface IContactModel extends IContact, Document {
    saveContact(): any;
  }
  

const contactSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    name:{
        type:String,
        required:true
    },
    phoneNumber:{
    type:String,
    required:true,
    unique:false
        }
},{
    timestamps:true
});


contactSchema.methods.saveContact = async function () {
    return this.save();
  };


  export interface IContactGroupModel extends IContactsGroup, Document {
    saveGroup(): any;
  }
  

  const groupContactSchema = new Schema({
    name:{
        type:String,
        required:true
    },
        phoneNumber:{
            type:String,
            required:true
        }
  },{timestamps:true});


  const groupSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"users"
    },
    groupName:{
        type:String,
        required:true
    },
    contacts:[groupContactSchema]
   
},{
    timestamps:true
});


groupSchema.methods.saveGroup = async function () {
    return this.save();
  };
  
  export const Contact: Model<IContactModel> = model<IContactModel>("Contact", contactSchema);
  export const ContactGroup: Model<IContactGroupModel> = model<IContactGroupModel>("ContactGroup", groupSchema);