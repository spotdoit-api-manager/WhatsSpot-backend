import {  } from './../socket';
import { HTTP200Error } from '../../utils/httpErrors';

import { EventEmitter } from 'events';
import { sendQrCode,sendAuthenticated, sendQrRetryExceed, sendConnectionClosed, sendError } from '../socket';
import clients from '../../../data/clients.data';
import Whatsapp from './whatsapp.service';
import deviceModel from '../../../components/device/device.model';


export const eventEmitter = new EventEmitter();

export class WhatsappClient{

    public getQr = (phone:string)=>{
        
        const client = new Whatsapp(phone);
        clients[phone] = client;
        client.on("qr",(qrData)=>{
            console.log("got qr ",qrData.qr);
            if(qrData.error) return;
            sendQrCode(phone,qrData.qr);
        });
        client.on("authenticated",(client)=>{
            console.log("got authenticated ",client.phone);
            sendAuthenticated(client.phone);
        })
        client.getQr();
    }

    public addClient = (phone:string)=>{
        const client = new Whatsapp(phone);
        clients[phone] = client;
    }

   

    public async initializeAllClients(){
        console.log("INITIALIZING ALL CLIENTS...");
        
        const condition = {authState:true};
        const devices = await deviceModel.findDeviceByCondition(condition);
        console.log("Total Clients to Initialize: ",devices.length);
        for (let i = 0; i < devices.length; i++) {
            const device = devices[i];
            console.log(`client${i}:${device.phone}`);
            
            this.addClient(device.phone);
        }
    }


}
export default new WhatsappClient();
