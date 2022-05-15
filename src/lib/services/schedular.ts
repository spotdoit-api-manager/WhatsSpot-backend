import * as scheduler from "node-schedule";
import deviceModel from ".../../../components/device/device.model";
import { EApiKeyStatus, IApiKey } from "../../components/device/device.interface";
import { Device, IApiKeyModal } from "../../components/device/device.schema";
import logger from "../../core/logger";
import { ObjectID } from "bson";
const logFileName ="[SpotSchedular]"; 

export class SpotSchedular{
    public async reScheduleAllApiExpiration(){
        logger.info(logFileName,"Rescheduling all api key expiration");
        const apiKeys= await Device.aggregate([
            { $match: {}},
            {$project:{
                apiKeys: 1,
            }}
        ]); 

        for(const deviceApi of apiKeys) {
            for(const api of deviceApi.apiKeys) {
              try{
                    await this.scheduleApiExpiration(deviceApi._id,api);
              }  catch(e){
                  logger.error(logFileName,`Error in  api expire scheduling of device ${deviceApi._id} for api ${api._id}`);
              }
            }
        }

    }
    public async scheduleApiExpiration(deviceId: string,apiKeyData: IApiKeyModal){
        logger.info(logFileName,`Scheduling api key expiration api key id: ${apiKeyData._id} at ${apiKeyData.expiresOn}`);
        const job = scheduler.scheduleJob(apiKeyData.expiresOn, async() => {
            await  this.expireApiKey(deviceId,apiKeyData);
        });
    }

    public async expireApiKey(deviceId: string, apiKey: IApiKeyModal) {
        logger.info(logFileName, `Expiring api key ${apiKey._id}`);
        const result = await Device.findOneAndUpdate({
            _id: new ObjectID(deviceId),
            "apiKeys._id": new ObjectID(apiKey._id),
        },
            { $set: { "apiKeys.$.status.status": EApiKeyStatus.EXPIRED } },
            {
                new: true
            }).lean();
    }
}

export default new SpotSchedular();