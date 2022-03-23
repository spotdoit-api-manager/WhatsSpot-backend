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
exports.ContactControler = void 0;
const contact_model_1 = __importDefault(require("./contact.model"));
const responseHandler_1 = __importDefault(require("../../lib/helpers/responseHandler"));
class ContactControler {
    addNewContact(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("New Contact Add Request");
                responseHandler.reqRes(req, res).onFetch("MESSAGE_SENT", yield contact_model_1.default.addNewContacts(req.userId, req.body.contacts)).send();
            }
            catch (e) {
                console.log(e);
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
    }
    fetchContacts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("Fetch Contact  Request");
                responseHandler.reqRes(req, res).onFetch("CONTACTS_FETCHED", yield contact_model_1.default.fetchContacts(req.userId)).send();
            }
            catch (e) {
                console.log(e);
                next(responseHandler.sendError(e));
            }
        });
    }
    fetchGroupContacts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("Fetch Group Contact  Request", req.params.groupId);
                responseHandler.reqRes(req, res).onFetch("GROUP_CONTACTS_FETCHED", yield contact_model_1.default.fetchGroupContacts(req.userId, req.params.groupId)).send();
            }
            catch (e) {
                console.log(e);
                next(responseHandler.sendError(e));
            }
        });
    }
    addContactsToGroup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("Add Contact to Group  Request", req.params.groupId);
                responseHandler.reqRes(req, res).onFetch("CONTACTS_ADDED_FETCHED", yield contact_model_1.default.addContactsToGroup(req.userId, req.params.groupId, req.body.contacts)).send();
            }
            catch (e) {
                console.log(e);
                next(responseHandler.sendError(e));
            }
        });
    }
    fetchGroups(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("Fetch Groups  Request");
                responseHandler.reqRes(req, res).onFetch("GROUP_FETCHED", yield contact_model_1.default.fetchGroups(req.userId)).send();
            }
            catch (e) {
                console.log(e);
                next(responseHandler.sendError(e));
            }
        });
    }
    createNewGroup(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("Group Create  Request");
                responseHandler.reqRes(req, res).onFetch("GROUP_CREATED", yield contact_model_1.default.createNewGroup(req.userId, req.body.groupName, (_a = req.body) === null || _a === void 0 ? void 0 : _a.contacts)).send();
            }
            catch (e) {
                console.log(e);
                next(responseHandler.sendError(e));
            }
        });
    }
    deleteGroup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("Group Create  Request");
                responseHandler.reqRes(req, res).onFetch("GROUP_DELETED", yield contact_model_1.default.deleteGroup(req.userId, req.params.groupId)).send();
            }
            catch (e) {
                console.log(e);
                next(responseHandler.sendError(e));
            }
        });
    }
    editContacts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("Edit Contact  Request");
                responseHandler.reqRes(req, res).onFetch("CONTACTS_EDITED", yield contact_model_1.default.editContacts(req.userId, req.body.contacts)).send();
            }
            catch (e) {
                console.log(e);
                next(responseHandler.sendError(e));
            }
        });
    }
    editGroupContacts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("Edit Contact  Request");
                responseHandler.reqRes(req, res).onFetch("CONTACTS_EDITED", yield contact_model_1.default.editGroupContacts(req.userId, req.params.groupId, req.body.contacts)).send();
            }
            catch (e) {
                console.log(e);
                next(responseHandler.sendError(e));
            }
        });
    }
    deleteContacts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("Edit Contact  Request");
                responseHandler.reqRes(req, res).onFetch("CONTACTS_DELETED", yield contact_model_1.default.deleteContacts(req.userId, req.body.contactsId)).send();
            }
            catch (e) {
                console.log(e);
                next(responseHandler.sendError(e));
            }
        });
    }
    deleteGroupContacts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("Delete Group Contact  Request");
                responseHandler.reqRes(req, res).onFetch("GROUP_CONTACTS_DELETED", yield contact_model_1.default.deleteGroupContacts(req.userId, req.params.groupId, req.body.contactsId)).send();
            }
            catch (e) {
                console.log(e);
                next(responseHandler.sendError(e));
            }
        });
    }
    addGroupContacts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("Group add Contact  Request");
                responseHandler.reqRes(req, res).onFetch("GROUP_CONTACT_ADDED", yield contact_model_1.default.addGroupContacts(req.userId, req.params.groupId, req.body.contacts)).send();
            }
            catch (e) {
                console.log(e);
                next(responseHandler.sendError(e));
            }
        });
    }
}
exports.ContactControler = ContactControler;
exports.default = new ContactControler();
//# sourceMappingURL=contact.controller.js.map