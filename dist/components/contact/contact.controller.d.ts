import { NextFunction, Request, Response } from "express";
export declare class ContactControler {
    addNewContact(req: Request, res: Response, next: NextFunction): Promise<void>;
    fetchContacts(req: Request, res: Response, next: NextFunction): Promise<void>;
    fetchGroupContacts(req: Request, res: Response, next: NextFunction): Promise<void>;
    addContactsToGroup(req: Request, res: Response, next: NextFunction): Promise<void>;
    fetchGroups(req: Request, res: Response, next: NextFunction): Promise<void>;
    createNewGroup(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteGroup(req: Request, res: Response, next: NextFunction): Promise<void>;
    editContacts(req: Request, res: Response, next: NextFunction): Promise<void>;
    editGroupContacts(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteContacts(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteGroupContacts(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const _default: ContactControler;
export default _default;
