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
interface IWhatsappClient {
    [phone: string]: number;
}

const logFileName = "[WhatsappClientService] : ";

export const eventEmitter = new EventEmitter();

export class WhatsappClient {
    
    clients: IWhatsappClient = clients;


    public addClient = (deviceId: string,phone: string) => {
        const clientInstance = new Whatsapp(deviceId,phone);
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
        const client = this.addClient(deviceId,phone);
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


    public async initializeAllClients() {
        if(process.env.RECONNECT_CLIENT === "true"){

            logger.info(logFileName,"INITIALIZING ALL CLIENTS...");
            const condition = { authState: true };
            const devices = await deviceUtils.findDeviceByCondition(condition);
            logger.info(logFileName,"Total Clients to Initialize: ", devices.length);
        for (let i = 0; i < devices.length; i++) {
            const device = devices[i];
            console.debug(logFileName,`client${i}:${device.phone}`);
            const client =  this.addClient(device._id,device.phone);
            await client.initiClient();
        }
        
    }else{
        logger.warn(logFileName,"Client initialization is disabled");
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

    }
}

}
export default new WhatsappClient();
