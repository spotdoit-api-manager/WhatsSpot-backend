import { HTTP400Error } from "./../../lib/utils/httpErrors";
import { EWhatsappMessageTypes } from "./../../lib/services/whatsapp/whatsapp.enum";
import { IConfig } from "./config.interface";
import Configs from "./configs.schema";

export class ConfigModel{
    constructor() {
        this.createDefaultConfig();
    }
public getConfigs = async (adminId: string) => {
    return Configs.findOne();
}

public updateConfigs = async (adminId: string, configs:IConfig) => {
    if(Object.values(EWhatsappMessageTypes).indexOf(configs.testMessageType) === -1) throw new HTTP400Error("Invalid Test Message Type");
    return Configs.findOneAndUpdate({},configs,{new:true});
}

private createDefaultConfig = async () => {
    if(await Configs.findOne()) return;
    const config = new Configs();
    return config.save();
}
}

export default new ConfigModel();