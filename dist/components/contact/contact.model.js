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
exports.ContactModal = void 0;
const phone_handler_1 = require("./../../lib/utils/phone.handler");
const bson_1 = require("bson");
const contact_schema_1 = require("./contact.schema");
const phone_handler_2 = require("../../lib/utils/phone.handler");
const logFileName = "[ContactsModel]";
class ContactModal {
    addNewContacts(userId, contacts) {
        return __awaiter(this, void 0, void 0, function* () {
            const newContacts = this.createNewContact(contacts, userId);
            const result = yield contact_schema_1.Contact.insertMany(newContacts, { ordered: false });
            return result;
        });
    }
    createNewContact(contacts, userId = null) {
        const newContacts = [];
        for (let i = 0; i < contacts.length; i++) {
            const contact = contacts[i];
            if (contact.country && contact.country.length > 0) {
                contact.phoneNumber = (0, phone_handler_1.parsePhoneWithCountry)(contact.phoneNumber, contact.country).number;
            }
            else {
                contact.phoneNumber = (0, phone_handler_2.parsePhone)(contacts[i].phoneNumber).number;
            }
            if (userId) {
                contact.userId = userId;
            }
            newContacts.push(contact);
        }
        return newContacts;
    }
    fetchContacts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield contact_schema_1.Contact.aggregate([
                { $match: { userId: new bson_1.ObjectID(userId) } },
                { $project: {
                        name: 1,
                        phoneNumber: 1
                    } }
            ]);
            return result;
        });
    }
    fetchGroupContacts(userId, groupId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield contact_schema_1.ContactGroup.aggregate([
                {
                    $match: { userId: new bson_1.ObjectID(userId), _id: new bson_1.ObjectID(groupId) },
                },
                {
                    $project: {
                        contacts: {
                            _id: 1,
                            name: 1,
                            phoneNumber: 1
                        }
                    }
                },
            ]);
            console.log(result);
            return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.contacts) || [];
        });
    }
    addContactsToGroup(userId, groupId, contacts) {
        return __awaiter(this, void 0, void 0, function* () {
            const newContacts = this.createNewContact(contacts);
            const result = yield contact_schema_1.ContactGroup.findByIdAndUpdate(groupId, { $addToSet: { contacts: { $each: newContacts } } }, { upsert: false, new: true }).lean();
            return result;
        });
    }
    fetchGroups(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield contact_schema_1.ContactGroup.aggregate([
                { $match: { userId: new bson_1.ObjectID(userId) } },
                {
                    $project: {
                        groupName: 1,
                        totalContacts: { $size: { $cond: { if: { $isArray: "$contacts" }, then: "$contacts", else: [] } }
                        }
                    }
                }
            ]);
            // console.log("group result is ",result);
            return result;
        });
    }
    createNewGroup(userId, groupName, contacts = []) {
        const newGroupBody = { groupName, userId, contacts };
        const newGroup = new contact_schema_1.ContactGroup(newGroupBody);
        const result = newGroup.saveGroup();
        return result;
    }
    deleteGroup(user, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield contact_schema_1.ContactGroup.findByIdAndDelete(groupId);
            return result;
        });
    }
    editContacts(userId, contacts) {
        return __awaiter(this, void 0, void 0, function* () {
            const finalResult = [];
            for (let i = 0; i < contacts.length; i++) {
                const contact = contacts[i];
                const result = yield contact_schema_1.Contact.findOneAndUpdate({ userId: new bson_1.ObjectID(userId) }, { name: contact.name, phoneNumber: contact.phoneNumber });
                finalResult.push(result);
            }
            return finalResult;
        });
    }
    editGroupContacts(userId, groupId, contacts) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < contacts.length; i++) {
                const contact = contacts[i];
                const result = yield contact_schema_1.ContactGroup.findOneAndUpdate({ _id: new bson_1.ObjectID(groupId), contacts: { $elemMatch: { _id: contact._id } } }, { $set: { "contacts.$.name": contact.name, "contacts.$.phoneNumber": contact.phoneNumber } });
            }
            return { message: "Updated" };
        });
    }
    deleteContacts(userId, contactsId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield contact_schema_1.Contact.deleteMany({ _id: { $in: contactsId } });
        });
    }
    deleteGroupContacts(userId, groupId, contactsId) {
        return __awaiter(this, void 0, void 0, function* () {
            const finalResult = [];
            for (let i = 0; i < contactsId.length; i++) {
                const cId = contactsId[i];
                const result = yield contact_schema_1.ContactGroup.findByIdAndUpdate(groupId, { $pull: { contacts: { _id: cId } } });
                finalResult.push(result);
            }
            return finalResult;
        });
    }
}
exports.ContactModal = ContactModal;
exports.default = new ContactModal();
//# sourceMappingURL=contact.model.js.map