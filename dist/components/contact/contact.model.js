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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactModal = void 0;
const bson_1 = require("bson");
const contact_schema_1 = require("./contact.schema");
const logger_1 = __importDefault(require("../../core/logger"));
const logFileName = "[ContactsModel]";
class ContactModal {
    addNewContacts(userId, contacts) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("New Contact ", contacts);
            const newContacts = this.createNewContact(contacts, userId);
            console.log("new contacts ", newContacts);
            const result = yield contact_schema_1.Contact.insertMany(newContacts, { ordered: false });
            return result;
        });
    }
    createNewContact(contacts, userId) {
        const newContacts = [];
        for (let i = 0; i < contacts.length; i++) {
            const contact = contacts[i];
            contact.userId = userId;
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
            console.log("add contact ", contacts);
            for (let i = 0; i < contacts.length; i++) {
                const contact = contacts[i];
                const result = yield contact_schema_1.ContactGroup.findByIdAndUpdate(groupId, { $push: { contacts: { name: contact.name, phoneNumber: contact.phoneNumber } } }, { upsert: true, new: true });
            }
            return [];
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
            const finalResult = [];
            // await Contact.deleteMany({_id:{$in:contactsId}});
            for (let i = 0; i < contactsId.length; i++) {
                const cId = contactsId[i];
                const result = yield contact_schema_1.Contact.findByIdAndDelete(cId);
                finalResult.push(result);
            }
            return finalResult;
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
    addGroupContacts(userId, groupId, contacts) {
        logger_1.default.info("add group contacts ", contacts);
    }
}
exports.ContactModal = ContactModal;
exports.default = new ContactModal();
//# sourceMappingURL=contact.model.js.map