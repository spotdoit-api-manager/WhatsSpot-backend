import { EPLANS } from "../../components/plans/plans.interface";
import { IReason } from "./whatsapp/whatsapp.interface";
export declare class NotifyService {
    constructor();
    private clearDeviceCache;
    private checkNotificationSettings;
    deviceUnAuthorized(deviceId: string): Promise<void>;
    deviceAuthorized(deviceId: string): Promise<void>;
    deviceConnectionClosed(deviceId: string, reason: IReason): Promise<void>;
    deviceMaxRetryReached(deviceId: string): Promise<void>;
    planExpired(userId: string, userPlanId: string): Promise<void>;
    planExhausted(userId: string, userPlanId: string): Promise<void>;
    planActivated(userId: string, userPlanId: string): Promise<void>;
    walletBalanceAdded(userId: string, added: number, balance: number, currency: string): Promise<void>;
    paymentApproveRequest(userId: string, planId: EPLANS, amount: number, transactionId: string): Promise<void>;
    paymentApprove(userId: string, planId: EPLANS, amount: number, transactionId: string): Promise<void>;
}
declare const _default: NotifyService;
export default _default;
