import { DeviceKeyValidator } from "../../lib/middleware/device-key.middleware";
import contactController from "./contact.controller";

export default [
  
{
    path:"/contact/add",
    method:"post",
    handler:[contactController.addNewContact]
},
{
    path:"/contact/fetch",
    method:"get",
    handler:[contactController.fetchContacts]
},
{
    path:"/contact/edit",
    method:"post",
    handler:[contactController.editContacts]
},
{
    path:"/contact/delete",
    method:"post",
    handler:[contactController.deleteContacts]
},

{
    path:"/contact/group/create",
    method:"post",
    handler:[contactController.createNewGroup]
},
{
    path:"/contact/group/fetch",
    method:"get",
    handler:[contactController.fetchGroups]
},
{
    path:"/contact/group/:groupId/contacts/fetch",
    method:"get",
    handler:[contactController.fetchGroupContacts]
},
{
    path:"/contact/group/:groupId/contacts/add",
    method:"post",
    handler:[contactController.addContactsToGroup]
},
{
    path:"/contact/group/:groupId/contacts/edit",
    method:"post",
    handler:[contactController.editGroupContacts]
},
{
    path:"/contact/group/:groupId/contacts/delete",
    method:"post",
    handler:[contactController.deleteGroupContacts]
},
{
    path:"/contact/group/:groupId/delete",
    method:"delete",
    handler:[contactController.deleteGroup]
},

];