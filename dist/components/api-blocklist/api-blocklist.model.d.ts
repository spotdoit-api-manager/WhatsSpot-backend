import { IApiKeyModal } from "../device/device.schema";
export declare class ApiBlockListModel {
    addApiToBlockList(deviceId: string, apiDetails: IApiKeyModal): Promise<void>;
}
declare const _default: ApiBlockListModel;
export default _default;
