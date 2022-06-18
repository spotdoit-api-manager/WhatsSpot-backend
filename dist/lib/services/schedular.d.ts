import { IUserPlanModel } from "./../../components/plans/plans.schema";
import { IApiKeyModal } from "../../components/device/device.schema";
export declare class SpotSchedular {
    reScheduleAllUserPlanExpiration(): Promise<void>;
    scheduleUserPlanExpiration(plan: IUserPlanModel): Promise<void>;
    reScheduleAllApiExpiration(): Promise<void>;
    scheduleApiExpiration(deviceId: string, apiKeyData: IApiKeyModal): Promise<void>;
    expireApiKey(deviceId: string, apiKey: IApiKeyModal): Promise<void>;
}
declare const _default: SpotSchedular;
export default _default;
