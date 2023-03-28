import { IConfig } from "./config.interface";
export declare class ConfigModel {
    constructor();
    getConfigs: (adminId: string) => Promise<any>;
    updateConfigs: (adminId: string, configs: IConfig) => Promise<any>;
    private createDefaultConfig;
}
declare const _default: ConfigModel;
export default _default;
