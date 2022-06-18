import { NextFunction, Request, Response } from "express";
export declare class AdminController {
    addNewAdmin: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    convertToSuperAdmin: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    convertToNormalAdmin: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    fetchAdmins: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    removeAdmin: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    loginWithPhone: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    verifyOtp: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    metrics: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    devicesList: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    fetchUsersBaseList: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    userDetailedAccountMetrics: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getDeviceData: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateUserWalletBalance: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    walletTransactions: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getLoggedUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    addProduct: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getProducts: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createPrice: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getPrices: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    fetchPaymentRequests: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    approvePayment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    rejectPayment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: AdminController;
export default _default;
