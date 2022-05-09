import contactModel from "./contact.model";
import { NextFunction, Request, Response } from "express";
import ResponseHandler from "../../lib/helpers/responseHandler";

export class ContactControler{

    public async addNewContact(req: Request,res: Response,next: NextFunction){
        const responseHandler = new ResponseHandler();
        try {    
            console.log("New Contact Add Request");
          responseHandler.reqRes(req, res).onFetch("MESSAGE_SENT", await contactModel.addNewContacts(req.userId,req.body.contacts)).send();
        } catch (e) {
            console.log(e);
            
          // send error with next function.
          next(responseHandler.sendError(e));
        }
    }   

    public async fetchContacts(req: Request,res: Response,next: NextFunction){
      const responseHandler = new ResponseHandler();
      try {    
          console.log("Fetch Contact  Request");
        responseHandler.reqRes(req, res).onFetch("CONTACTS_FETCHED", await contactModel.fetchContacts(req.userId)).send();
      } catch (e) {
          console.log(e);
                  next(responseHandler.sendError(e));
      }
  }   

  public async fetchGroupContacts(req: Request,res: Response,next: NextFunction){
    const responseHandler = new ResponseHandler();
    try {    
        console.log("Fetch Group Contact  Request",req.params.groupId);
      responseHandler.reqRes(req, res).onFetch("GROUP_CONTACTS_FETCHED", await contactModel.fetchGroupContacts(req.userId,req.params.groupId)).send();
    } catch (e) {
        console.log(e);
                next(responseHandler.sendError(e));
    }
} 


public async addContactsToGroup(req: Request,res: Response,next: NextFunction){
  const responseHandler = new ResponseHandler();
  try {    
      console.log("Add Contact to Group  Request",req.params.groupId);
    responseHandler.reqRes(req, res).onFetch("CONTACTS_ADDED_FETCHED", await contactModel.addContactsToGroup(req.userId,req.params.groupId,req.body.contacts)).send();
  } catch (e) {
      console.log(e);
              next(responseHandler.sendError(e));
  }
} 
public async fetchGroups(req: Request,res: Response,next: NextFunction){
  const responseHandler = new ResponseHandler();
  try {    
      console.log("Fetch Groups  Request");
    responseHandler.reqRes(req, res).onFetch("GROUPS_FETCHED", await contactModel.fetchGroups(req.userId)).send();
  } catch (e) {
      console.log(e);
              next(responseHandler.sendError(e));
  }
} 


public async createNewGroup(req: Request,res: Response,next: NextFunction){
  const responseHandler = new ResponseHandler();
  try {    
      console.log("Group Create  Request");
    responseHandler.reqRes(req, res).onFetch("GROUP_CREATED", await contactModel.createNewGroup(req.userId,req.body.groupName,req.body?.contacts)).send();
  } catch (e) {
      console.log(e);
              next(responseHandler.sendError(e));
  }
} 

public async deleteGroup(req: Request,res: Response,next: NextFunction){
  const responseHandler = new ResponseHandler();
  try {    
      console.log("Group Create  Request");
    responseHandler.reqRes(req, res).onFetch("GROUP_DELETED", await contactModel.deleteGroup(req.userId,req.params.groupId)).send();
  } catch (e) {
      console.log(e);
              next(responseHandler.sendError(e));
  }
} 


  public async editContacts(req: Request,res: Response,next: NextFunction){
    const responseHandler = new ResponseHandler();
    try {    
        console.log("Edit Contact  Request");
      responseHandler.reqRes(req, res).onFetch("CONTACTS_EDITED", await contactModel.editContacts(req.userId,req.body.contacts)).send();
    } catch (e) {
        console.log(e);
                next(responseHandler.sendError(e));
    }
}  

public async editGroupContacts(req: Request,res: Response,next: NextFunction){
  const responseHandler = new ResponseHandler();
  try {    
      console.log("Edit Contact  Request");
    responseHandler.reqRes(req, res).onFetch("CONTACTS_EDITED", await contactModel.editGroupContacts(req.userId,req.params.groupId,req.body.contacts)).send();
  } catch (e) {
      console.log(e);
              next(responseHandler.sendError(e));
  }
}  

public async deleteContacts(req: Request,res: Response,next: NextFunction){
  const responseHandler = new ResponseHandler();
  try {    
      console.log("Edit Contact  Request");
    responseHandler.reqRes(req, res).onFetch("CONTACTS_DELETED", await contactModel.deleteContacts(req.userId,req.body.contactsId)).send();
  } catch (e) {
      console.log(e);
              next(responseHandler.sendError(e));
  }
}  

public async deleteGroupContacts(req: Request,res: Response,next: NextFunction){
  const responseHandler = new ResponseHandler();
  try {    
      console.log("Delete Group Contact  Request");
    responseHandler.reqRes(req, res).onFetch("GROUP_CONTACTS_DELETED", await contactModel.deleteGroupContacts(req.userId,req.params.groupId,req.body.contactsId)).send();
  } catch (e) {
      console.log(e);
              next(responseHandler.sendError(e));
  }
}  


public async addGroupContacts(req: Request,res: Response,next: NextFunction){
  const responseHandler = new ResponseHandler();
  try {    
      console.log("Group add Contact  Request");
    responseHandler.reqRes(req, res).onFetch("GROUP_CONTACT_ADDED", await contactModel.addGroupContacts(req.userId,req.params.groupId,req.body.contacts)).send();
  } catch (e) {
      console.log(e);
              next(responseHandler.sendError(e));
  }
}  

}

export default new ContactControler();