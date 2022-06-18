import { NextFunction, Request, Response } from "express";
declare class UserController {
    fetchAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    registerWithPhone: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    loginWithPhone: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    resendOTP: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    fetch: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    delete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    fetchAccountMetrics: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    loginViaSocialAccessToken: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    socialAuthAddPhone: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    verifyOtp: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getLoggedUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getActivePlan: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    signUp: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateNotificationSettings: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    logIn: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    isVerified: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    generateOTP: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    addPhoneNumber: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    sendEmailVerification: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    verifyEmaliOtp: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    verifyUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: UserController;
export default _default;
