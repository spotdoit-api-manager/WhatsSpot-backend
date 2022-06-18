import { IUserPlanModel } from "./../../components/plans/plans.schema";
import * as scheduler from "node-schedule";
import deviceModel from ".../../../components/device/device.model";
import { EApiKeyStatus, IApiKey } from "../../components/device/device.interface";
import { Device, IApiKeyModal } from "../../components/device/device.schema";
import logger from "../../core/logger";
import { ObjectID } from "bson";
import { UserPlan } from "../../components/plans/plans.schema";
import userModel from "../../components/user/user.model";
import plansModel from "../../components/plans/plans.model";
const logFileName ="[SpotSchedular]"; 

export class SpotSchedular{

    public async reScheduleAllUserPlanExpiration(){
        logger.info(logFileName,"Rescheduling all user plan expiration");
        const userPlans= await UserPlan.aggregate([
            { $match: {}}
        ]);

        for(const plan of userPlans) {
            try{
               
                await this.scheduleUserPlanExpiration(plan);
            }  catch(e){
                logger.error(logFileName,`Error in  user plan expire scheduling of user ${plan._id}`);
            }
        }

    }

    public async scheduleUserPlanExpiration(plan: IUserPlanModel){
        logger.info(logFileName,`Scheduling user plan expiration  ${plan._id} at ${plan.endDate}`);
        const now = new Date();
        const expiresOn = plan.endDate;
        if(expiresOn<now){
           return plansModel.expirePlan(plan);
        }
        const job = scheduler.scheduleJob(plan.endDate, async() => {
            await plansModel.expirePlan(plan);
        });
    }
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
        const now = new Date();
        if(apiKeyData.expiresOn<now){
            return await this.expireApiKey(deviceId,apiKeyData);
        }
        logger.info(logFileName,`Scheduling api key expiration ${apiKeyData._id} at ${apiKeyData.expiresOn}`);
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