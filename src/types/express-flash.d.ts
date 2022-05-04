/// <reference types="express" />

/**
 * This type definition augments existing definition
 * from @types/express-flash
 */
declare namespace Express {
    export interface Request {
        flash(event: string, message: any): any;
        userId?: string
        role?: string,
        token?: string,
        isAuth?: boolean,
        deviceId?: string,
        walletId?:string,
        testMessageId?:string|null,
        file:{
            location: string
        }
    }
}

interface Flash {
    flash(type: string, message: any): void;
}

declare module "express-flash";

