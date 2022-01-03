import { NextFunction, Request, Response } from "express";
export declare class DeviceController {
    newDevice: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getQr: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: DeviceController;
export default _default;
