import { IImageMessage } from './../../lib/services/whatsapp/whatsapp.interface';
import { IMessage } from './../messages/message.interface';
import { HTTP400Error } from './../../lib/utils/httpErrors';
import { IDevice, TextMessage } from "./device.interface";
import { Device } from "./device.shema";
import whatsappClientService from '../../lib/services/whatsapp/whatsapp-client.service';
import fileManagement from '../../lib/helpers/file.management';
import { DisconnectReason } from '@adiwajshing/baileys-md';
import messageModel from '../messages/message.model';
import { body } from 'express-validator';

export class DeviceModel {
    public async newDevice(body: IDevice) {
        console.log(body);
        const device = await this.findDeviceByPhone(body.phone);
        if (device) throw new HTTP400Error("DEVICE_ALREADY_PRESENT");
        const newDevice = new Device(body);
        const data = await newDevice.saveDevice();
        return data;
    }

    public async getQr(body: any) {
        const device = await this.findDeviceById(body.deviceId);
        if (!device) throw new HTTP400Error("DEVICE_NOT_FOUND");
        console.log("qr request for phone ", device.phone);
        if (device.authState) return { message: "ALREADY_AUTHENTICATED" };
        if (!device.authState && device.reason && device.reason.statusCode === DisconnectReason.loggedOut) {
            return { message: "DEVICE_LOGGED_OUT" };
        }
        const data = whatsappClientService.getClientQr(device.phone);
        return { message: "QR_REQUESTED" };
    };

    public async addMessageToQueue(body:any,deviceId:string){
        console.log("send text message request");
        const device = await this.findDeviceById(deviceId);
        if (!device) throw new HTTP400Error("DEVICE_NOT_FOUND");
        const numbers = body.numbers.split(",");
        for (let i = 0; i < numbers.length; i++) {
            const to = "91"+numbers[i];
            const newBody:IMessage = {phone:device.phone,to,message:body.message,status:"pending"}
            const result =await messageModel.addMessageToQueue(newBody);
        }
       
        return {message:"Message Added To Queue"}
    }
    
    public async sendTextMessage(body:any,deviceId:string){
        const device = await this.findDeviceById(deviceId);
        if (!device) throw new HTTP400Error("DEVICE_NOT_FOUND");
        const result =await whatsappClientService.sendTextMessage(device.phone,body.to,body.message);
        console.log(result);
    }

    public async sendImageMessage(body:any,deviceId:string){
        const device = await this.findDeviceById(deviceId);
        if (!device) throw new HTTP400Error("DEVICE_NOT_FOUND");
        const to = body.to;
        const msg:IImageMessage = {image:body.locationUrl,caption:body.caption||''};
        const result =await whatsappClientService.sendImageMessage(device.phone,to,msg);
        console.log(result);
    }


    public async deleteAuth(body: any) {
        const device = await this.findDeviceById(body.deviceId);
        if (!device) throw new HTTP400Error("DEVICE_NOT_FOUND");
        console.log("delete auth request for phone ", device.phone);
        const authFilePath = `${device.phone}_cred.json`;
        fileManagement.deleteFile(authFilePath);
        await this.updateDevice(device.phone, { reason: null });
        return { message: "AUTH_DELETED" };
    };

    public async logoutDevice(body: any) {
        const device = await this.findDeviceById(body.deviceId);
        if (!device) throw new HTTP400Error("DEVICE_NOT_FOUND");
        const data = await whatsappClientService.logoutClient(device.phone);
        if (data.error) throw new HTTP400Error(data.message);
        return { message: "DEVICE_LOGGED_OUT" };

    }

    public async updateDevice(phone: string, clientData: any) {
        console.log("updaing client ", phone, clientData);
        if (!phone) return console.log("phone not provided in client update");
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const client = await Device.findOneAndUpdate({ phone: phone }, { ...clientData }, options);
        if (!client) return { error: true, message: "some error occured" };
        return { error: false }
    }


    public async findDeviceByPhone(phone: string) {
        const device = await Device.findOne({ phone });
        return device;
    }

    public async findDeviceById(id: string) {
        const device = await Device.findById(id);
        return device;
    }

    public async findDeviceByCondition(condition) {
        const data = await Device.aggregate([{
            $match: condition
        }])
        return data;
    }
}

export default new DeviceModel();