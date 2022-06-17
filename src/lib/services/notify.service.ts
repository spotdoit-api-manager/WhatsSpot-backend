import { EPLANS } from "../../components/plans/plans.interface";
import { ENotificationMainTypes } from "../interfaces/notification.interface";
import { User } from "../../components/user/user.schema";
import messageService from "./message.service";
import { IReason } from "./whatsapp/whatsapp.interface";
import { Device } from "../../components/device/device.schema";
import logger from "../../core/logger";
import * as emailService from "./email.service";
import { ENotificationChannel } from "../interfaces/notification.interface";
import { IUserNotificationSettings } from "../../components/user/user.interface";

const CACHE_CLEAR_INTERVAL = 20;
let deviceIdPhoneMap: { [key: string]: { notificationSettings: IUserNotificationSettings; devicePhone: string; email: string; phone: string } } = {};
const logFileName = "[NotifyService] : ";
export class NotifyService {

    constructor() {
        this.clearDeviceCache();
    }

    private clearDeviceCache() {
        logger.info(logFileName, `Started interval to clear device data cache every ${CACHE_CLEAR_INTERVAL} minutes`);
        const interval = setInterval(() => {
            deviceIdPhoneMap = {};
        }, CACHE_CLEAR_INTERVAL * 1000);
    }

    private checkNotificationSettings(notificationSettings: IUserNotificationSettings, notificationMainType: ENotificationMainTypes, channel: ENotificationChannel) {
        if (notificationSettings[notificationMainType][channel]) {
            return true;
        }
        return false;
    }




    // device event notification
    public async deviceUnAuthorized(deviceId: string) {
        try {
            logger.info(`Sending DEVICE_UNAUTHORIZED notification for device ${deviceId}`);
            if (!deviceIdPhoneMap[deviceId]) {
                const device = (await Device.findById(deviceId).select("userId").lean());
                const userData = (await User.findById(device.userId).select("phone email userName").lean());
                deviceIdPhoneMap[deviceId] = { notificationSettings: userData.settings.notifications, devicePhone: device.phone, phone: userData.phone, email: userData.email };
            }

            if (this.checkNotificationSettings(deviceIdPhoneMap[deviceId].notificationSettings, ENotificationMainTypes.DEVICE, ENotificationChannel.WHATSAPP)) {
                messageService.sendWhatsappMessage(deviceIdPhoneMap[deviceId].phone, `Your device with Phone ${deviceIdPhoneMap[deviceId].devicePhone} is unauthorized.`);
            }

            if (this.checkNotificationSettings(deviceIdPhoneMap[deviceId].notificationSettings, ENotificationMainTypes.DEVICE, ENotificationChannel.EMAIL)) {
                emailService.sendNotificationMail(deviceIdPhoneMap[deviceId].email, "DEVICE UNAUTHORIZED", `Your device with Phone ${deviceIdPhoneMap[deviceId].devicePhone} is unauthorized.`);
            }

        } catch (e) {
            logger.error(`Error sending DEVICE_UNAUTHORIZED notification for device ${deviceId}`, e.message);
        }

    }

    public async deviceAuthorized(deviceId: string) {
        try {
            logger.info(`Sending DEVICE_AUTHORIZED notification for device ${deviceId}`);
            if (!deviceIdPhoneMap[deviceId]) {
                const device = (await Device.findById(deviceId).select("userId").lean());
                const userData = (await User.findById(device.userId).select("phone email userName").lean());
                deviceIdPhoneMap[deviceId] = { notificationSettings: userData.settings.notifications, devicePhone: device.phone, phone: userData.phone, email: userData.email };
            }
                logger.info("device cacheche is ",deviceIdPhoneMap);
            if (this.checkNotificationSettings(deviceIdPhoneMap[deviceId].notificationSettings, ENotificationMainTypes.DEVICE, ENotificationChannel.WHATSAPP)) {
                messageService.sendWhatsappMessage(deviceIdPhoneMap[deviceId].phone, `Device with phone ${deviceIdPhoneMap[deviceId].devicePhone} Authorized successfully`);
            }

            if (this.checkNotificationSettings(deviceIdPhoneMap[deviceId].notificationSettings, ENotificationMainTypes.DEVICE, ENotificationChannel.EMAIL)) {
                emailService.sendNotificationMail(deviceIdPhoneMap[deviceId].email, "DEVICE AUTHORIZED", `Device with phone ${deviceIdPhoneMap[deviceId].devicePhone} Authorized successfully`);
            }


        } catch (e) {
            logger.error(`Error sending DEVICE_AUTHORIZED notification for device ${deviceId}`, e.message);
        }
    }
    public async deviceConnectionClosed(deviceId: string, reason: IReason) {
        try {
            logger.info(`Sending DEVICE_CONNECTION_CLOSED notification for device ${deviceId}`);
            if (!deviceIdPhoneMap[deviceId]) {
                const device = (await Device.findById(deviceId).select("userId").lean());
                const userData = (await User.findById(device.userId).select("phone email userName").lean());
                deviceIdPhoneMap[deviceId] = { notificationSettings: userData.settings.notifications, devicePhone: device.phone, phone: userData.phone, email: userData.email };
            }
            if(this.checkNotificationSettings(deviceIdPhoneMap[deviceId].notificationSettings, ENotificationMainTypes.DEVICE, ENotificationChannel.WHATSAPP)){
                emailService.sendNotificationMail(deviceIdPhoneMap[deviceId].email, "DEVICE UNAUTHORIZED", `Your device with Phone ${deviceIdPhoneMap[deviceId].devicePhone} is unauthorized.`);
            }
            if(this.checkNotificationSettings(deviceIdPhoneMap[deviceId].notificationSettings, ENotificationMainTypes.DEVICE, ENotificationChannel.WHATSAPP)){
                messageService.sendWhatsappMessage(deviceIdPhoneMap[deviceId].phone, `Your device with Phone ${deviceIdPhoneMap[deviceId].devicePhone} is unauthorized.`);
            }

            
        } catch (e) {
            logger.error(`Error sending DEVICE_CONNECTION_CLOSED notification for device ${deviceId}`, e.message);
        }
    }

    public async deviceMaxRetryReached(deviceId: string) {
        try {
            logger.info(`Sending DEVICE_MAX_RETRY_REACHED notification for device ${deviceId}`);
            if (!deviceIdPhoneMap[deviceId]) {
                const device = (await Device.findById(deviceId).select("userId").lean());
                const userData = (await User.findById(device.userId).select("phone email userName").lean());
                deviceIdPhoneMap[deviceId] = { notificationSettings: userData.settings.notifications, devicePhone: device.phone, phone: userData.phone, email: userData.email };
            }
            if(this.checkNotificationSettings(deviceIdPhoneMap[deviceId].notificationSettings, ENotificationMainTypes.DEVICE, ENotificationChannel.WHATSAPP)){
                emailService.sendNotificationMail(deviceIdPhoneMap[deviceId].email, "DEVICE UNAUTHORIZED", `Device with phone ${deviceIdPhoneMap[deviceId].devicePhone} has reached max retry to reconnect`);
            }
            if(this.checkNotificationSettings(deviceIdPhoneMap[deviceId].notificationSettings, ENotificationMainTypes.DEVICE, ENotificationChannel.WHATSAPP)){
                messageService.sendWhatsappMessage(deviceIdPhoneMap[deviceId].phone, `Device with phone ${deviceIdPhoneMap[deviceId].devicePhone} has reached max retry to reconnect`);
            }  
        } catch (e) {
            logger.error(`Error sending DEVICE_MAX_RETRY_REACHED notification for device ${deviceId}`, e.message);
        }

    }

    // Plan event notification 
    public async planExpired(userId: string, userPlanId: string) {
        try {
            logger.info(`Sending PLAN_EXPIRED notification for user ${userId} and plan ${userPlanId}`);
            const userData = (await User.findById(userId).select("phone email userName").lean());

            if (this.checkNotificationSettings(userData.settings.notifications, ENotificationMainTypes.PLAN, ENotificationChannel.WHATSAPP)) {
                messageService.sendWhatsappMessage(userData.phone, `Dear ${userData.userName}, \n Your plan has been expired. Please purchase new plan to continue the services`);
            }

            if(this.checkNotificationSettings(userData.settings.notifications, ENotificationMainTypes.PLAN, ENotificationChannel.EMAIL)){
                emailService.sendNotificationMail(userData.email, "DEVICE UNAUTHORIZED", `Dear ${userData.userName}, \n Your plan has been expired. Please purchase new plan to continue the services`);
            }

        } catch (e) {
            logger.error(`Error sending PLAN_EXPIRED notification for user ${userId}  for  plan ${userPlanId}`, e.message);
        }
    }

    public async planExhausted(userId: string, userPlanId: string) {
        try {
            logger.info(`Sending PLAN_EXHAUSTED notification for user ${userId} and plan ${userPlanId}`);
            const userData = (await User.findById(userId).select("phone email userName").lean());
            if(this.checkNotificationSettings(userData.settings.notifications, ENotificationMainTypes.PLAN, ENotificationChannel.WHATSAPP)){
                messageService.sendWhatsappMessage(userData.phone, `Dear ${userData.userName}, \n Your plan has reached max message limit. Please purchase new plan to continue the services`);
            }
            if(this.checkNotificationSettings(userData.settings.notifications, ENotificationMainTypes.PLAN, ENotificationChannel.EMAIL)){
                emailService.sendNotificationMail(userData.email, "PLAN EXHAUSTED", `Dear ${userData.userName}, \n Your plan has reached max message limit. Please purchase new plan to continue the services`);
            }



        } catch (e) {
            logger.error(`Error sending PLAN_EXHAUSTED notification for user ${userId}  for  plan ${userPlanId}`, e.message);
        }
    }

    public async planActivated(userId: string, userPlanId: string) {
        try {
            logger.info(`Sending PLAN_ACTIVATED notification for user ${userId} and plan ${userPlanId}`);
            const userData = (await User.findById(userId).select("phone email userName").lean());
            if(this.checkNotificationSettings(userData.settings.notifications, ENotificationMainTypes.PLAN, ENotificationChannel.WHATSAPP)){
                messageService.sendWhatsappMessage(userData.phone, `Dear ${userData.userName}, \n You plan has been activated.`);
            }
            if(this.checkNotificationSettings(userData.settings.notifications, ENotificationMainTypes.PLAN, ENotificationChannel.EMAIL)){
                emailService.sendNotificationMail(userData.email, "PLAN ACTIVATED", `Dear ${userData.userName}, \n You plan has been activated.`);
            }

        } catch (e) {
            logger.error(`Error sending PLAN_ACTIVATED notification for user ${userId}  for  plan ${userPlanId}`, e.message);
        }
    }
    public async paymentApproveRequest(userId: string, planId: EPLANS,transactionId: string) {
        try {
            logger.info(`Sending PAYMENT_APPROVAL notification for user ${userId} and plan ${planId}`);
            const userData = (await User.findById(userId).select("phone email userName").lean());
            // if(this.checkNotificationSettings(userData.settings.notifications, ENotificationMainTypes.PLAN, ENotificationChannel.WHATSAPP)){
                messageService.sendWhatsappMessage(userData.phone, `Dear ${userData.userName}, \n We have received your payment request approval for transactionId ${transactionId}.`);
            // }
            // if(this.checkNotificationSettings(userData.settings.notifications, ENotificationMainTypes.PLAN, ENotificationChannel.EMAIL)){
                emailService.sendNotificationMail(userData.email, "PAYMENT APPROVAL REQUEST", `Dear ${userData.userName}, \n We have received your payment request approval for transactionId ${transactionId}.`);
            // }

        } catch (e) {
            logger.error(`Error sending PLAN_ACTIVATED notification for user ${userId}  for  plan ${planId}`, e.message);
        }
    }
}

export default new NotifyService();