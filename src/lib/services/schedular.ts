import * as scheduler from "node-schedule";
import deviceModel from ".../../../components/device/device.model";
import { IApiKey } from "../../components/device/device.interface";
import { IApiKeyModal } from "../../components/device/device.schema";
import logger from "../../core/logger";
const logFileName ="[SpotSchedular]"; 

export class SpotSchedular{
    public async scheduleApiExpiration(deviceId: string,apiKeyData: IApiKeyModal){
        logger.info(logFileName,`Scheduling api key expiration api key id: ${apiKeyData._id}`);
        const job = scheduler.scheduleJob(apiKeyData.expiresOn, async() => {
            //  deviceModel.expireApiKey(deviceId,apiKeyData);
        });
    }
}

export default new SpotSchedular();