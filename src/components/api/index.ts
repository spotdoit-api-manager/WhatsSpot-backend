import { DeviceKeyValidator } from "../../lib/middleware/device-key.middleware";
import contactController from "../contact/contact.controller";
import walletController from "../wallet/wallet.controller";

export default [
    {
        path: "/wallet/balance",
        method: "get",
        escapeAuth: true,
        handler: [DeviceKeyValidator,walletController.fetchBalance]
    },
    {
        path:"/contacts", //user api to fetch contacts
        method:"get",
        escapeAuth:true,
        handler:[DeviceKeyValidator,contactController.fetchContacts]
    },
    {
        path:"/contacts/groups", //user api to fetch contacts
        method:"get",
        escapeAuth:true,
        handler:[DeviceKeyValidator,contactController.fetchGroups]
    },
    {
        path:"/contact/group/contacts/:groupId", //user api to fetch contacts
        method:"get",
        escapeAuth:true,
        handler:[DeviceKeyValidator,contactController.fetchGroupContacts]
    },
];