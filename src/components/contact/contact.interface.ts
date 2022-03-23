export interface IContact{
    name:string,
    phoneNumber:string
}


export interface IContactsGroup{
    groupName:string,
    userId:string,
    contacts:IContact[]
}


export interface IGroupList{
    groupName:string,
    totalContacts:number,
    _id:string
}