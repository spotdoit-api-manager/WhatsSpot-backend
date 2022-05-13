import { parsePhoneWithCountry } from "./../../lib/utils/phone.handler";
import { MessageQueue } from "./../messages/message.schema";
import { ObjectID } from "bson";
import { IContact, IContactsGroup } from "./contact.interface";
import { IContactModel,Contact, ContactGroup, IContactGroupModel } from "./contact.schema";
import logger from "../../core/logger";
import { parsePhone } from "../../lib/utils/phone.handler";
const logFileName = "[ContactsModel]";
export class ContactModal{

        public async addNewContacts(userId: string,contacts: IContact[]){        
            
            const newContacts: IContactModel[]= this.createNewContact(contacts,userId);
                    const result = await Contact.insertMany(newContacts,{ordered:false});
                    return result;
   
        }

        private createNewContact(contacts: IContact[],userId: string){
            const newContacts: IContactModel[]=[];
            for (let i = 0; i < contacts.length; i++) {
                const contact: any = contacts[i];
                 contact.phoneNumber = parsePhone(contacts[i].phoneNumber).number;
                contact.userId = userId;
                newContacts.push(contact);
            }
            return newContacts;
        }


        public async fetchContacts(userId: string){
            const result = await Contact.aggregate([
                {$match:{userId:new ObjectID(userId)}},
                {$project:{
                    name:1,
                    phoneNumber:1
                }}
            ]);
            
            return result;
        }

        public async fetchGroupContacts(userId: string,groupId: string){
            const result = await ContactGroup.aggregate([
                {
                    $match:{userId:new ObjectID(userId),_id:new ObjectID(groupId)},
                },
                {
                    $project:{
                        contacts:{
                            _id:1,
                            name:1,
                            phoneNumber:1
                        }
                    }
                },
              
            ]);
            console.log(result);
            return result[0]?.contacts || [];
        }

        public async addContactsToGroup(userId: string,groupId: string,contacts: IContact[]){
            const results =[];
            for (let i = 0; i < contacts.length; i++) {
                const contact = contacts[i];
                contact.phoneNumber = parsePhoneWithCountry(contact.phoneNumber,contact.country).number; 
            }
            for (let i = 0; i < contacts.length; i++) {
                const contact = contacts[i];
                const result = await ContactGroup.findByIdAndUpdate(groupId,{$push:{contacts:{name:contact.name,phoneNumber:contact.phoneNumber}}},{ upsert: true, new : true}).lean();
                results.push(result);

            }
                
            return results;
        }

        public async fetchGroups(userId: string){
            const result = await ContactGroup.aggregate([
                {$match:{userId:new ObjectID(userId)}},
                {
                $project:{
                    groupName:1,
                    totalContacts:{$size:{ $cond: { if: { $isArray: "$contacts" }, then: "$contacts", else: [] } }
                    } 
                }
            }
            ]);
            // console.log("group result is ",result);
            return result;
        }

        public createNewGroup(userId: string,groupName: string,contacts: IContactsGroup[]=[]){
            const newGroupBody = {groupName,userId,contacts};
            const newGroup = new ContactGroup(newGroupBody);
            const result: IContactGroupModel = newGroup.saveGroup(); 
            return result;
        }

        public async deleteGroup(user: string,groupId: string){
            const result: IContactGroupModel = await ContactGroup.findByIdAndDelete(groupId);
            return result;
        }

        public async editContacts(userId: string,contacts: IContactModel[]){
            const finalResult =[];
            for (let i = 0; i < contacts.length; i++) {
                const contact = contacts[i];
                const result = await Contact.findOneAndUpdate({userId:new ObjectID(userId)},{name:contact.name,phoneNumber:contact.phoneNumber});
                finalResult.push(result);
            }
            return finalResult;
        }

        public async editGroupContacts(userId: string,groupId: string,contacts: IContactModel[]){
            for (let i = 0; i < contacts.length; i++) {
                const contact: IContactModel = contacts[i];
                const result = await ContactGroup.findOneAndUpdate({_id:new ObjectID(groupId),contacts: {$elemMatch: {_id: contact._id}}},{$set:{"contacts.$.name":contact.name,"contacts.$.phoneNumber":contact.phoneNumber}});       
            }
            return {message:"Updated"};
        }

        public async deleteContacts(userId: string,contactsId: string[]){
            const finalResult =[];
            // await Contact.deleteMany({_id:{$in:contactsId}});
            for (let i = 0; i < contactsId.length; i++) {
                const cId = contactsId[i];
                const result = await Contact.findByIdAndDelete(cId);
                finalResult.push(result);
            }
            return finalResult;
        }

        public async deleteGroupContacts(userId: string,groupId: string,contactsId: string[]){
            const finalResult =[];
            for (let i = 0; i < contactsId.length; i++) {
                const cId = contactsId[i];
                const result = await ContactGroup.findByIdAndUpdate(groupId, {$pull:{contacts:{_id:cId}}});
                finalResult.push(result);
            }
            return finalResult;
        }

       

        public addGroupContacts(userId: string,groupId: string,contacts: IContact[]){
                logger.info("add group contacts ",contacts);
        }
}

export default new ContactModal();