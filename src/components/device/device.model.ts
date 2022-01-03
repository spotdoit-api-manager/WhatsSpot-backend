import { HTTP400Error } from './../../lib/utils/httpErrors';
import whatsappService, { Whatsapp } from "./../../lib/services/whatsapp.service";
import { IDevice } from "./device.interface";
import { Device } from "./device.shema";
export class DeviceModel{
    public async newDevice(body:IDevice){
        console.log(body);
        const device = await this.findDeviceByPhone(body.phone);
        if(device) throw new HTTP400Error("DEVICE_ALREADY_PRESENT");
        const newDevice = new Device(body);
        const data = await newDevice.saveDevice();
        return data;
    }
    
    public async getQr(body:any){
        const device = await this.findDeviceByPhone(body.phone);
        if(!device) throw new HTTP400Error("DEVICE_NOT_AVAILABLE");
        const data = await whatsappService.getQr(body.phone);
        return {message:"QR_REQUESTED"};
    };

    public async findDeviceByPhone(phone:string){
        const device = await Device.findOne({phone});
        return device; 
    }
}

export default new DeviceModel();