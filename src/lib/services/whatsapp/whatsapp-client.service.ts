import socketManager from './../socket';
import { HTTP200Error } from '../../utils/httpErrors';

import { EventEmitter } from 'events';
import clients from '../../../data/clients.data';
import Whatsapp from './whatsapp.service';
import deviceModel from '../../../components/device/device.model';
import messageQueueService from './message-queue.service';
import { IImageMessage } from './whatsapp.interface';
import { sanatizeMobile } from '../../../lib/utils';
import instanceProvider from './instance.provider';

interface IWhatsappClient {
    [phone: string]: number
}

export const eventEmitter = new EventEmitter();
export class WhatsappClient {
    
    clients: IWhatsappClient = clients;


    public addClient = (phone: string) => {
        const clientInstance = new Whatsapp(phone);
        const instaceId = instanceProvider.getInstanceId(clientInstance); 
        clients[phone] = instaceId;    
        console.log(`Number of instance present = ${Object.keys(this.clients).length}`);
        return clientInstance;
    }

    public getClientInstanceByPhone(phone:string){
        return this.getClientInstanceByInstanceId(this.clients[phone]);
    }

    public getClientInstanceByInstanceId = (instanceId:number)=>{
        try{ 
            const instance = instanceProvider.getClassInstance(Whatsapp, instanceId); 
            return instance;
        }catch(e){
            throw new Error("CLIENT_NOT_AUTHENTICATED");
        }
    }

    
    public async logoutClient(phone: string) {
        try {
            const client = this.getClientInstanceByPhone(phone);
            client.logoutClient();
            client.on('LOGGEDOUT', (data: any) => {
                console.log("logout listner ", data);
                socketManager.sendLoggedout(data);
            })
            return { error: false }
        } catch (e) {
            return { error: true, message: e.message }
        }
    }

  
    public getClientQr = async (phone: string) => {
        this.removeClientInstanceByPhone(phone);
        const client = this.addClient(phone);
        client.on("qr", (qrData) => {
            console.log("got qr ", qrData.qr);
            socketManager.sendQrCode(phone, qrData);
        });

        client.on("authenticated", (client) => {
            console.log("got authenticated ", client.phone);
            socketManager.sendAuthenticated(client.phone);
        })
       const result:any =  await client.initiClient();
       if(result.error) return result;
        client.getQr();
    }

    public removeClientInstanceByPhone(phone:string){
        console.log(`Removing client ${phone}`);
        const instanceId = this.clients[phone];
        if(!instanceId) return {error:true,message:"INSTANCE_NOT_FOUND"};
        delete this.clients[phone];
        return this.removeClientByInstanceId(instanceId);
    }

    private removeClientByInstanceId(instanceId:number) {
        try {
            console.log(`Removing client instance ${instanceId}`);

            let instance =  instanceProvider.getClassInstance(Whatsapp, instanceId);
            instance.endClient();
            instanceProvider.removeClassInstance(Whatsapp, instanceId);
            instance =null;
            return {error:false,message:"client removed"}

        } catch (err) {
            console.log("error in client end ", err);
            return {error:true,message:err.message}
        }
    }

    public sendTextMessage = async (phone: string, to: string, message: string) => {
        try {
            console.log("sending message to ", to);
            const clientInstance = this.getClientInstanceByPhone(phone);
            if (!clientInstance) return { error: true, message: "CLIENT_NOT_FOUND" };
            if (!clientInstance.authState) return { error: true, message: "CLIENT_NOT_AUTHENTICATED" };
            const data = await clientInstance.sendTextMessage(sanatizeMobile(to), message);
            return data;
        } catch (e) {
            return { error: true, message: e.message };
        }
    };

    public sendImageMessage = async (phone: string, to: string, msg: IImageMessage) => {
        try {
            console.log("sending image message to ", to);
            const client = this.getClientInstanceByPhone(phone);
            if (!client) return { error: true, message: "CLIENT_NOT_FOUND" };
            if (!client.authState) return { error: true, message: "CLIENT_NOT_AUTHENTICATED" };

            const data = await client.sendImageMessage(to, msg);
            console.log("image sent data is ", data);

            return data;
        } catch (e) {
            return { error: true, message: e.message };
        }
    }


    public async initializeAllClients() {
        console.info("INITIALIZING ALL CLIENTS...");
        const condition = { authState: true };
        const devices = await deviceModel.findDeviceByCondition(condition);
        console.info("Total Clients to Initialize: ", devices.length);
        for (let i = 0; i < devices.length; i++) {
            const device = devices[i];
            console.log(`client${i}:${device.phone}`);
           const client =  this.addClient(device.phone);
           await client.initiClient();
        }

        setTimeout(()=>{//to do
            console.log("STARTED_MESSAGE_QUEUE_SERVICE...");
            // messageQueueService();
        },10000)
    }




}
export default new WhatsappClient();
