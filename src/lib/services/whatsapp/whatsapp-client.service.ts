import socketManager from './../socket';
import { HTTP200Error } from '../../utils/httpErrors';

import { EventEmitter } from 'events';
import clients from '../../../data/clients.data';
import Whatsapp from './whatsapp.service';
import deviceModel from '../../../components/device/device.model';
import messageQueueService from './message-queue.service';
import { IImageMessage } from './whatsapp.interface';

interface IWhatsappClient {
    [phone: string]: WhatsappClient
}

export const eventEmitter = new EventEmitter();

export class WhatsappClient {
    clients: IWhatsappClient = clients;
    public getClientQr = async (phone: string) => {
        this.removeQrListner(phone);
        const client = this.addClient(phone);
        client.on("qr", (qrData) => {
            console.log("got qr ", qrData.qr);
            // if (qrData.error) return;
            socketManager.sendQrCode(phone, qrData);
        });
        client.on("authenticated", (client) => {
            console.log("got authenticated ", client.phone);
            socketManager.sendAuthenticated(client.phone);
        })
        client.getQr();
    }

    private removeQrListner(phone: string) {
        try {
            if (clients[phone]) {
                clients[phone].endClient();
                clients[phone] = null;
            }
        } catch (err) {
            console.log("error in client end ", err);

        }
    }

    public async logoutClient(phone: string) {
        try {
            clients[phone].logoutClient();
            clients[phone].on('LOGGEDOUT', (data: any) => {
                console.log("logout listner ", data);

                socketManager.sendLoggedout(data);
            })
            return { error: false }
        } catch (e) {
            return { error: true, message: e.message }
        }
    }

    public addClient = (phone: string) => {
        const client = new Whatsapp(phone);
        clients[phone] = client;
        // client.auth
        return client;
    }

    public getClient = (phone: string) => {
        return clients[phone];
    }
    public sendTextMessage = async (phone: string, to: string, message: string) => {
        try {
            console.log("sending message to ", to);
            const client = this.getClient(phone);
            if (!client) return { error: true, message: "CLIENT_NOT_FOUND" };
            if (!client.authState) return { error: true, message: "CLIENT_NOT_AUTHENTICATED" };
            const data = await client.sendTextMessage(to, message);
            return data;
        } catch (e) {
            return { error: true, message: e.message };
        }
    };

    public sendImageMessage = async (phone: string, to: string, msg: IImageMessage) => {
        try {
            console.log("sending image message to ", to);
            const client = this.getClient(phone);
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
            this.addClient(device.phone);
        }

        setTimeout(()=>{//to do
            console.log("STARTED_MESSAGE_QUEUE_SERVICE...");
            messageQueueService.getPendingsMessages();
        },10000)
    }




}
export default new WhatsappClient();
