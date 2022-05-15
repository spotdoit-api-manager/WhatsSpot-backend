import { User } from "../../components/user/user.schema";
import  OTPMessagesService  from "./message.service";
import { IReason } from "./whatsapp/whatsapp.interface";
import { Device } from "../../components/device/device.schema";
import logger from "../../core/logger";
import * as emailService from "./email.service";

const deviceIdPhoneMap: {[key: string]: {devicePhone: string;email: string; phone: string}} = {};

export class NotifyService{

 

    // device event notification
    public async deviceUnAuthorized(deviceId: string){
        try{
            logger.info(`Sending DEVICE_UNAUTHORIZED notification for device ${deviceId}`);
            if(!deviceIdPhoneMap[deviceId]){
                const device = (await Device.findById(deviceId).select("userId").lean());
                const userData = (await User.findById(device.userId).select("phone email userName").lean());
                deviceIdPhoneMap[deviceId] = {devicePhone:device.phone,phone:userData.phone,email:userData.email};
            }
            OTPMessagesService.sendWhatsappMessage(deviceIdPhoneMap[deviceId].phone,`Your device with Phone ${deviceIdPhoneMap[deviceId].devicePhone} is unauthorized.`);
             emailService.sendNotificationMail(deviceIdPhoneMap[deviceId].email,"DEVICE UNAUTHORIZED",`Your device with Phone ${deviceIdPhoneMap[deviceId].devicePhone} is unauthorized.`);
        }catch(e){
            logger.error(`Error sending DEVICE_UNAUTHORIZED notification for device ${deviceId}`,e.message);
        }

    }

    public async deviceAuthorized(deviceId: string){
        try{
            logger.info(`Sending DEVICE_AUTHORIZED notification for device ${deviceId}`);
            if(!deviceIdPhoneMap[deviceId]){
                const device = (await Device.findById(deviceId).select("userId").lean());
                const userData = (await User.findById(device.userId).select("phone email userName").lean());
                deviceIdPhoneMap[deviceId] = {devicePhone:device.phone,phone:userData.phone,email:userData.email};
            }
   
            OTPMessagesService.sendWhatsappMessage(deviceIdPhoneMap[deviceId].phone,`Device with phone ${deviceIdPhoneMap[deviceId].devicePhone} Authorized successfully`);
            emailService.sendNotificationMail(deviceIdPhoneMap[deviceId].email,"DEVICE AUTHORIZED",`Device with phone ${deviceIdPhoneMap[deviceId].devicePhone} Authorized successfully`);
    
        }catch(e){
            logger.error(`Error sending DEVICE_AUTHORIZED notification for device ${deviceId}`,e.message);
        }
    }
    public async deviceConnectionClosed(deviceId: string,reason: IReason){
        try{
            logger.info(`Sending DEVICE_CONNECTION_CLOSED notification for device ${deviceId}`);
            if(!deviceIdPhoneMap[deviceId]){
                const device = (await Device.findById(deviceId).select("userId").lean());
                const userData = (await User.findById(device.userId).select("phone email userName").lean());
                deviceIdPhoneMap[deviceId] = {devicePhone:device.phone,phone:userData.phone,email:userData.email};
            }
            emailService.sendNotificationMail(deviceIdPhoneMap[deviceId].email,"DEVICE UNAUTHORIZED",`Your device with Phone ${deviceIdPhoneMap[deviceId].devicePhone} is unauthorized.`);
            OTPMessagesService.sendWhatsappMessage(deviceIdPhoneMap[deviceId].phone,`Your device with Phone ${deviceIdPhoneMap[deviceId].devicePhone} is unauthorized.`);
    
        }catch(e){
            logger.error(`Error sending DEVICE_CONNECTION_CLOSED notification for device ${deviceId}`,e.message);
        }
    }

    public async deviceMaxRetryReached(deviceId: string){
        try{
            logger.info(`Sending DEVICE_MAX_RETRY_REACHED notification for device ${deviceId}`);
            if(!deviceIdPhoneMap[deviceId]){
                const device = (await Device.findById(deviceId).select("userId").lean());
                const userData = (await User.findById(device.userId).select("phone email userName").lean());
                deviceIdPhoneMap[deviceId] = {devicePhone:device.phone,phone:userData.phone,email:userData.email};
            }
            emailService.sendNotificationMail(deviceIdPhoneMap[deviceId].email,"DEVICE UNAUTHORIZED",`Device with phone ${deviceIdPhoneMap[deviceId].devicePhone} has reached max retry to reconnect`);
            OTPMessagesService.sendWhatsappMessage(deviceIdPhoneMap[deviceId].phone,`Device with phone ${deviceIdPhoneMap[deviceId].devicePhone} has reached max retry to reconnect`);
    
        }catch(e){
            logger.error(`Error sending DEVICE_MAX_RETRY_REACHED notification for device ${deviceId}`,e.message);
        }

    }

    // Plan event notification 
    public async planExpired(userId: string,userPlanId: string){
        try{
            logger.info(`Sending PLAN_EXPIRED notification for user ${userId} and plan ${userPlanId}`);
            const userData = (await User.findById(userId).select("phone email userName").lean());
                emailService.sendNotificationMail(userData.email,"DEVICE UNAUTHORIZED",`Dear ${userData.userName}, \n Your plan has been expired. Please purchase new plan to continue the services`);
                OTPMessagesService.sendWhatsappMessage(userData.phone,`Dear ${userData.userName}, \n Your plan has been expired. Please purchase new plan to continue the services`);
    
        }catch(e){
            logger.error(`Error sending PLAN_EXPIRED notification for user ${userId}  for  plan ${userPlanId}`,e.message);
        }
    }

    public async planExhausted(userId: string, userPlanId: string){
        try{
            logger.info(`Sending PLAN_EXHAUSTED notification for user ${userId} and plan ${userPlanId}`);
            const userData = (await User.findById(userId).select("phone email userName").lean());
            emailService.sendNotificationMail(userData.email,"PLAN EXHAUSTED",`Dear ${userData.userName}, \n Your plan has reached max message limit. Please purchase new plan to continue the services`);
            OTPMessagesService.sendWhatsappMessage(userData.phone,`Dear ${userData.userName}, \n Your plan has reached max message limit. Please purchase new plan to continue the services`);
    
        }catch(e){
            logger.error(`Error sending PLAN_EXHAUSTED notification for user ${userId}  for  plan ${userPlanId}`,e.message);
        }
    }

    public async planActivated(userId: string,userPlanId: string){
        try{
            logger.info(`Sending PLAN_ACTIVATED notification for user ${userId} and plan ${userPlanId}`);
            const userData = (await User.findById(userId).select("phone email userName").lean());
            emailService.sendNotificationMail(userData.email,"PLAN ACTIVATED",`Dear ${userData.userName}, \n You plan has been activated.`);
            OTPMessagesService.sendWhatsappMessage(userData.phone,`Dear ${userData.userName}, \n You plan has been activated.`);
    
        }catch(e){
            logger.error(`Error sending PLAN_ACTIVATED notification for user ${userId}  for  plan ${userPlanId}`,e.message);
        }
    }

}

export default new NotifyService();