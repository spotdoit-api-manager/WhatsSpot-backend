import { NextFunction, Request, Response } from "express";
export declare class DeviceController {
    newDevice: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    newDeviceCode: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getQr: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    removeClient: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    fetchAllDevices: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    fetchDevice: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    logoutDevice: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    generateNewKey: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getKeys: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteKey: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    addMessageToQueue: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    retryFailedMessage: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    sendTextMessage: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    sendImageMessage: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    fetchPrevMessages: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    fetchDeviceMetrics: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    removeDevice: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getDeviceStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: DeviceController;
export default _default;
