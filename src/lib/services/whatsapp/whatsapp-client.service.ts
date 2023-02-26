import { EMessageStatus } from "./../../../components/messages/message.interface";
import { IWebHookMessage } from "./../../../components/webhooks/webhooks.interface";
import { IWebHook } from "./../../../components/device/device.interface";
import { IDeviceModel } from "./../../../components/device/device.schema";
import { IWhatsAppIMageButtonMessage, IWhatsappImageTemplateMessage } from "./whatsapp.interface";
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { IWhatsappListMessage,IWhatsappButtonMessage, IWhatsappTemplateMessage, IWhatsappMessage } from "./whatsapp.interface";

import socketManager from "./../socket";

import { EventEmitter } from "events";
import clients from "../../../data/clients.data";
import Whatsapp from "./whatsapp.service";
import deviceModel from "../../../components/device/device.model";
import { IImageMessage, IWhatsappTextMessage } from "./whatsapp.interface";
import { sanatizeMobile } from "../../../lib/utils";
import instanceProvider from "./instance.provider";
import logger from "../../../core/logger";
import { HTTP400Error } from "../../../lib/utils/httpErrors";
import deviceUtils from "../../../components/device/device.utils";
import { EWhatsappMessageTypes } from "./whatsapp.enum";
import axios from "axios";
import walletModel from "../../../components/wallet/wallet.model";
import planManagerService from "../plan.manager.service";
import plansModel from "../../../components/plans/plans.model";
import webhooksModel from "../../../components/webhooks/webhooks.model";
import fileManagement from "../../../lib/helpers/file.management";
import WhatsappOld from "./whatsapp.service.old";

interface IWhatsappClient {
    [phone: string]: number;
}

const logFileName = "[WhatsappClientService] : ";

export const eventEmitter = new EventEmitter();

export class WhatsappClient {
    
    clients: IWhatsappClient = clients;


    public addClient = async (deviceId: string,phone: string) => {
        // const check if session folder contains phon_cred.json
        let clientInstance;
        const isOld =  await this.checkIfOldSessionPresent(phone);
        console.log("isOld===> ",isOld);
       if(isOld){
        console.log("------------------OLD SESSION INSTANCE------------------");
        clientInstance = new WhatsappOld(deviceId,phone);
       }else{
        console.log("---------------NEW SESSION INSTANCE-------------------");
           clientInstance = new Whatsapp(deviceId,phone);
        }

        const instaceId = instanceProvider.getInstanceId(clientInstance); 
        logger.info(logFileName,`Adding client ${phone}`);
        clients[phone] = instaceId;    
        console.info(logFileName,`Number of instance present = ${Object.keys(this.clients).length}`);
        return clientInstance;
    }

    public getClientStatus(phone: string){
        const client = this.getClientInstanceByPhone(phone);
        if(!client) return {error:false,message:"CLIENT_NOT_AUTHENTICATED"};
        return client.getDeviceStatus();
    }

    public getClientInstanceByPhone(phone: string){
        return this.getClientInstanceByInstanceId(this.clients[phone]);
    }

    public getClientInstanceByInstanceId = (instanceId: number)=>{
        try{ 
            const instance = instanceProvider.getClassInstance(Whatsapp, instanceId); 
            return instance;
        }catch(e){
            console.error(e);
            throw new Error("CLIENT_NOT_AUTHENTICATED");
        }
    }

    
    public async logoutClient(phone: string) {
        try {
            const client = this.getClientInstanceByPhone(phone);
            if(!client) return {error:false,message:"CLIENT_NOT_AUTHENTICATED"};
           const result  = await client.logoutClient();
           if(result.error) throw new HTTP400Error(result.message);
            client.on("LOGGED_OUT", (data: any) => {
                socketManager.sendLoggedOut(data);
            });
            return { error: false };
        } catch (e) {
            return { error: true, message: e.message };
        }
    }

  
    public getClientQr = async (deviceId: string,phone: string) => {
        this.removeClientInstanceByPhone(phone);
        const client = await this.addClient(deviceId,phone);
        client.on("qr", (qrData) => {
            console.debug(logFileName,"got qr ", qrData.qr);
            socketManager.sendQrCode(phone, qrData);
        });

        client.on("authenticated", (client) => {
            console.debug(logFileName,"got authenticated ", client.phone);
            socketManager.sendAuthenticated(client.phone);
        });
       const result: any =  await client.initiClient();
       if(result.error) return result;
        client.getQr();
    }

    public removeClientInstanceByPhone(phone: string){
        console.debug(logFileName,`Removing client ${phone}`);
        const instanceId = this.clients[phone];
        if(!instanceId) return {error:true,message:"INSTANCE_NOT_FOUND"};
        delete this.clients[phone];
        return this.removeClientByInstanceId(instanceId);
    }

    private removeClientByInstanceId(instanceId: number) {
        try {
            console.debug(logFileName,`Removing client ${instanceId}`);

            let instance =  instanceProvider.getClassInstance(Whatsapp, instanceId);
            instance.endClient();
            instanceProvider.removeClassInstance(Whatsapp, instanceId);
            instance =null;
            return {error:false,message:"client removed"};

        } catch (err) {
            console.error(logFileName,"error in client end ", err);
            return {error:true,message:err.message};
        }
    }

    public sendTextMessage = async (from: string, to: string, message: IWhatsappTextMessage) => {
        try {
            logger.info(logFileName,`Sending Text Message to ${to} | from: ${from}`);
            const clientInstance = this.getClientInstanceByPhone(from);
            if (!clientInstance){
                logger.error(logFileName,`Client not found ${from}`);
                return { error: true, message: "CLIENT_NOT_FOUND" };
            }
            if (!clientInstance.authState) {
                logger.error(logFileName,`Client not authenticated ${from}`);
                return { error: true, message: "CLIENT_NOT_AUTHENTICATED" };
            }
            const data = await clientInstance.sendAnyMessage(sanatizeMobile(to), message);
            return data;
        } catch (e) {
            return { error: true, message: e.message };
        }
    };

    public sendListMessage = async(from: string,to: string,message: IWhatsappListMessage) => {
        try {
            logger.info(logFileName,`Sending List Message to ${to}`);
            const clientInstance = this.getClientInstanceByPhone(from);
            if (!clientInstance) return { error: true, message: "CLIENT_NOT_AUTHENTICATED" };
            if (!clientInstance.authState) return { error: true, message: "CLIENT_NOT_AUTHENTICATED" };
            const data = await clientInstance.sendAnyMessage(sanatizeMobile(to), message);
            return data;
        } catch (e) {
            return { error: true, message: e.message };
        }
    }

    public sendButtonMessage = async(from: string,to: string,message: IWhatsappButtonMessage) => {
        try {
            logger.info(logFileName,`Sending Button Message to ${to}`);
            const clientInstance = this.getClientInstanceByPhone(from);
            if (!clientInstance) return { error: true, message: "CLIENT_NOT_AUTHENTICATED" };
            if (!clientInstance.authState) return { error: true, message: "CLIENT_NOT_AUTHENTICATED" };
            const data = await clientInstance.sendAnyMessage(sanatizeMobile(to), message);
            return data;
        } catch (e) {
            return { error: true, message: e.message };
        }
    }

    public sendTemplateMessage = async(from: string,to: string,message: IWhatsappTemplateMessage) => {
        try {
            logger.info(logFileName,`Sending Template Message to ${to}`);
            const clientInstance = this.getClientInstanceByPhone(from);
            if (!clientInstance) return { error: true, message: "CLIENT_NOT_AUTHENTICATED" };
            if (!clientInstance.authState) return { error: true, message: "CLIENT_NOT_AUTHENTICATED" };
            const data = await clientInstance.sendAnyMessage(sanatizeMobile(to), message);
            return data;
        } catch (e) {
            return { error: true, message: e.message };
        }
    }

    public sendImageButtonMessage = async(from: string,to: string,message: IWhatsAppIMageButtonMessage) => {
        try {
            logger.info(logFileName,`Sending Template Message to ${to}`);
            const clientInstance = this.getClientInstanceByPhone(from);
            if (!clientInstance) return { error: true, message: "CLIENT_NOT_AUTHENTICATED" };
            if (!clientInstance.authState) return { error: true, message: "CLIENT_NOT_AUTHENTICATED" };
            console.log(message);
            const data = await clientInstance.sendAnyMessage(sanatizeMobile(to), message);
            return data;
        } catch (e) {
            return { error: true, message: e.message };
        }
    }

    public sendImageTemplateMessage = async(from: string,to: string,message: IWhatsappImageTemplateMessage) => {
        try {
            logger.info(logFileName,`Sending Image Template Message to ${to}`);
            const clientInstance = this.getClientInstanceByPhone(from);
            if (!clientInstance) return { error: true, message: "CLIENT_NOT_AUTHENTICATED" };
            if (!clientInstance.authState) return { error: true, message: "CLIENT_NOT_AUTHENTICATED" };
            console.log(message);
            const data = await clientInstance.sendAnyMessage(sanatizeMobile(to), message);
            return data;
        } catch (e) {
            return { error: true, message: e.message };
        }
    }
    public async sendRawMessage(phone: string,to: string,message: any){
        try {
            logger.info(logFileName,`Sending Raw Message to ${to}`);
            const clientInstance = this.getClientInstanceByPhone(phone);
            if (!clientInstance) return { error: true, message: "CLIENT_NOT_AUTHENTICATED" };
            if (!clientInstance.authState) return { error: true, message: "CLIENT_NOT_AUTHENTICATED" };
            const data = await clientInstance.sendAnyMessage(sanatizeMobile(to), message);
            return data;
        } catch (e) {
            return { error: true, message: e.message };
        }
    }

    public sendImageMessage = async (phone: string, to: string, msg: IImageMessage) => {
        try {
            console.debug(logFileName,"sending image message to ", to);
            const client = this.getClientInstanceByPhone(phone);
            if (!client) return { error: true, message: "CLIENT_NOT_AUTHENTICATED" };
            if (!client.authState) return { error: true, message: "CLIENT_NOT_AUTHENTICATED" };

            const data = await client.sendAnyMessage(to, msg);
            console.log("image sent data is ", data);

            return data;
        } catch (e) {
            return { error: true, message: e.message };
        }
    }


public async sendTypeMessage(messageType: EWhatsappMessageTypes,message: IWhatsappMessage,from: string,to: string){
    switch(messageType){
        case EWhatsappMessageTypes.TEXT_MESSAGE:
            return await this.sendTextMessage(from, to, message as IWhatsappTextMessage);
        case EWhatsappMessageTypes.LIST_MESSAGE:
            return await this.sendListMessage(from, to, message as IWhatsappListMessage);    
        case EWhatsappMessageTypes.BUTTON_MESSAGE:
            return await this.sendButtonMessage(from, to, message as IWhatsappButtonMessage);    
        case EWhatsappMessageTypes.TEMPLATE_MESSAGE:
             return await this.sendTemplateMessage(from, to, message as IWhatsappTemplateMessage);  
        case EWhatsappMessageTypes.IMAGE_BUTTON_MESSAGE:
             return await this.sendImageButtonMessage(from, to, message as IWhatsAppIMageButtonMessage);   
        case EWhatsappMessageTypes.IMAGE_TEMPLATE_MESSAGE:
            return await this.sendImageTemplateMessage(from, to, message as IWhatsappImageTemplateMessage);     
        default:
             return {error: true, message: "INVALID_MESSAGE_TYPE"};      

    }
}



public async initializeAllClients() {
    if(process.env.RECONNECT_CLIENT === "true"){

        logger.info(logFileName,"INITIALIZING ALL CLIENTS...");
        const condition = { authState: true };
        const devices = await deviceUtils.findDeviceByCondition(condition);
        logger.info(logFileName,"Total Clients to Initialize: ", devices.length);
    for (let i = 0; i < devices.length; i++) {
        try{

            const device:IDeviceModel = devices[i];
            const walletId:string = await walletModel.getWalletIdByUserId(device.userId);
            console.debug(logFileName,`client${i}:${device.phone}`);
            const client =  await this.addClient(device._id,device.phone);
            await client.initiClient(false);
            // filter active webhooks from device and subscribe to client for each
            
            const activeWebHooks:IWebHook[] = device.webHooks.filter((webHook: IWebHook) => webHook.status);
            if(activeWebHooks.length >= 0){
                this.subscribeClientMessage(device.userId,walletId,client,activeWebHooks);
            } 
        }catch(e){
            logger.error(logFileName,"Error in initializing client",e);
        }
    }
    
}else{
    logger.warn(logFileName,"Client initialization is disabled");
}

}

public subscribeNewWebHook(userId:string,walletId:string,webHook:IWebHook,phone:string){
    const client = this.getClientInstanceByPhone(phone);
    if(client){
        this.subscribeClientMessage(userId,walletId,client,[webHook]);
    }
}

public unsubscribeWebHook(userId:string,walletId:string,webHooks:IWebHook[],phone:string){
    const client = this.getClientInstanceByPhone(phone);
    // unsubscribe NEW_MESSAGE event from client
    if(client){
        // unsubscribe to event NEW_MESSAGE
        client.removeAllListeners("NEW_MESSAGE");
        // client.off("NEW_MESSAGE");
        // subscribe to client for remaining webhooks
        if(webHooks.length > 0){
            this.subscribeClientMessage(userId,walletId,client,webHooks);
        }
    }
}
private subscribeClientMessage(userId:string,walletId:string,client: any,webHooks: IWebHook[]) {
    logger.info(logFileName,"Subscribing to client message "+client.phone);
    client.on("NEW_MESSAGE", (msg: any) => {
        // console.log("message received in subscribe", msg);
        const urls = webHooks.map((webHook: IWebHook) => webHook.url);
        const body:IWebHookMessage = this.whatsAppToWebHookMessage(client.deviceId,msg,urls);

        // extract url of webhook having isDeleted false and status true
        webHooks = webHooks.filter((webHook: IWebHook) => webHook.status && !webHook.isDeleted);
        if(webHooks.length === 0){
            return this.unsubscribeWebHook(userId,walletId,webHooks,client.phone);
        }
        this.sendWebHookRequest(userId,walletId,client.deviceId,client.phone,webHooks,body);
    });
}

private async sendWebHookRequest(userId:string,walletId:string,deviceId:string,phone:string,webHooks:IWebHook[],body:IWebHookMessage){
    const totalAmount = webHooks.length * parseFloat(process.env.WEBHOOK_REQUEST_RATE || "0.2");
    const urls = webHooks.map((webHook: IWebHook) => webHook.url);
    const { hasActivePlan, isMessageOver, activePlanInfo } = await planManagerService.hasActivePlan(userId);
    if (!hasActivePlan || isMessageOver) {
    //   pause webhooks
    console.log("Webhook paused for device: ",deviceId," due to NO_ACTIVE_PLAN",urls);
    this.unsubscribeWebHook(userId,walletId,webHooks,phone);
    const device = await deviceUtils.findDeviceById(userId,deviceId);
    device.webHooks = device.webHooks.map((webHook: IWebHook) => {
        if (webHook.url === urls[0]) {
            webHook.status = false;
            webHook.reason = "NO_ACTIVE_PLAN";
        }
        return webHook;
    });
    await device.save();
    return;
    }
    const req = [];
    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        req.push(axios.post(url,body));
    }
    axios.all(req).then(axios.spread((...responses) => {
        const res = responses.map((response: any) => response.data);
        console.log("Webhook send successfully to :",urls);
            plansModel.increamentMessageCount(activePlanInfo._id);
            webhooksModel.createWebhookMessage(userId,body,EMessageStatus.ERROR);
           return { error: false, creditUsed: 0, message: urls };
    })).catch(errors => {
        console.log("webhook request error: ",errors);
        webhooksModel.createWebhookMessage(userId,body,EMessageStatus.ERROR);

    });
}

private whatsAppToWebHookMessage(deviceId:string,message: any,urls:string[]) {
    const body:IWebHookMessage = {
        message:message.message?.conversation || message.message?.extendedTextMessage?.text,
        from:message.key.remoteJid.split("@")[0],
        name:message.pushName,
        timestamp:message.messageTimestamp,
        deviceId,
        urls
    };
    return body;
}

private async checkIfOldSessionPresent(phone: string) {
    const authFilePath = `${process.env.SESSIONS_FOLDER}/${phone}_cred.json`;
    const isPresent = await fileManagement.isFilePresent(authFilePath);
    return isPresent;
}
}
export default new WhatsappClient();
