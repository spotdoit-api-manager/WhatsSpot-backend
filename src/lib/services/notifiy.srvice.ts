import logger from "../utils/logger";
import { IReason } from "./whatsapp/whatsapp.interface";

export class NotifyService{

    // device event notification
    public deviceUnAuthorized(deviceId: string){
        try{
            logger.info(`Sending DEVICE_UNAUTHORIZED notification for device ${deviceId}`);
        }catch(e){
            logger.error(`Error sending DEVICE_UNAUTHORIZED notification for device ${deviceId}`,e.message);
        }

    }

    public deviceAuthorized(deviceId: string){
        try{
            logger.info(`Sending DEVICE_UNAUTHORIZED notification for device ${deviceId}`);

        }catch(e){
            logger.error(`Error sending DEVICE_UNAUTHORIZED notification for device ${deviceId}`,e.message);
        }
    }
    public deviceConnectionClosed(deviceId: string,reason: IReason){
        try{
            logger.info(`Sending DEVICE_CONNECTION_CLOSED notification for device ${deviceId}`);
        }catch(e){
            logger.error(`Error sending DEVICE_CONNECTION_CLOSED notification for device ${deviceId}`,e.message);
        }
    }

    public deviceMaxRetryReached(deviceId: string){
        try{
            logger.info(`Sending DEVICE_MAX_RETRY_REACHED notification for device ${deviceId}`);
        }catch(e){
            logger.error(`Error sending DEVICE_MAX_RETRY_REACHED notification for device ${deviceId}`,e.message);
        }

    }

    // Plan event notification 
    public planExpired(userId: string,userPlanId: string){
        try{
            logger.info(`Sending PLAN_EXPIRED notification for user ${userId} and plan ${userPlanId}`);
        }catch(e){
            logger.error(`Error sending PLAN_EXPIRED notification for user ${userId}  for  plan ${userPlanId}`,e.message);
        }
    }

    public planExhausted(userId: string, userPlanId: string){
        try{
            logger.info(`Sending PLAN_EXHAUSTED notification for user ${userId} and plan ${userPlanId}`);
        }catch(e){
            logger.error(`Error sending PLAN_EXHAUSTED notification for user ${userId}  for  plan ${userPlanId}`,e.message);
        }
    }

    public planActivated(userId: string,userPlanId: string){
        try{
            logger.info(`Sending PLAN_ACTIVATED notification for user ${userId} and plan ${userPlanId}`);
        }catch(e){
            logger.error(`Error sending PLAN_ACTIVATED notification for user ${userId}  for  plan ${userPlanId}`,e.message);
        }
    }

}

export default new NotifyService();