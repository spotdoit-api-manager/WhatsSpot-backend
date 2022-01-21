import { deviceKeyConfig } from './../../config/index';
import { IImageMessage } from './../../lib/services/whatsapp/whatsapp.interface';
import { IMessage } from './../messages/message.interface';
import { HTTP400Error, HTTP401Error } from './../../lib/utils/httpErrors';
import { IDevice, TextMessage } from "./device.interface";
import { Device } from "./device.shema";
import whatsappClientService from '../../lib/services/whatsapp/whatsapp-client.service';
import fileManagement from '../../lib/helpers/file.management';
import messageModel from '../messages/message.model';
import { ObjectID } from 'bson';
import jwt from 'jsonwebtoken';
import dayjs from 'dayjs'
export class DeviceModel {
    public async newDevice(body: IDevice, userId: string) {
        console.log(body);
        body.userId = userId;
        const device = await this.findDeviceByPhone(body.phone);
        if (device) return device;
        const newDevice = new Device(body);
        const data = await newDevice.saveDevice();
        return data;
    }

    public async getQr(body: any) {
        const device = await this.findDeviceById(body.deviceId);
        if (!device) throw new HTTP400Error("DEVICE_NOT_FOUND");
        console.log("qr request for phone ", device.phone);
        if (device.authState) return { message: "ALREADY_AUTHENTICATED" };
        // if (!device.authState && device.reason && device.reason.statusCode === DisconnectReason.loggedOut) {
        //     return { message: "DEVICE_LOGGED_OUT" };
        // }
        const data = whatsappClientService.getClientQr(device.phone);
        return { message: "QR_REQUESTED" };
    };

    public fetchAllDevices = async (userId: string) => {
        console.log("fetch all device request", userId);

        const devices = await this.findDeviceByUseId(userId);
        if (!devices || !devices.length) throw new HTTP400Error("NO_DEVICE_ADDED");
        return devices;
    }
    public fetchDevice = async (deviceId: string, userId: string) => {

    }

    public async addMessageToQueue(body: any, deviceId: string) {
        console.log("send text message request");
        const device = await this.findDeviceById(deviceId);
        if (!device) throw new HTTP400Error("DEVICE_NOT_FOUND");
        const numbers = body.numbers.split(",");
        for (let i = 0; i < numbers.length; i++) {
            const to = "91" + numbers[i];
            const newBody: IMessage = { phone: device.phone, to, message: body.message, status: "pending" }
            const result = await messageModel.addMessageToQueue(newBody);
        }

        return { message: "Message Added To Queue" }
    }

    public async sendTextMessage(body: any, deviceId: string) {
        const device = await this.findDeviceById(deviceId);
        if (!device) throw new HTTP400Error("DEVICE_NOT_FOUND");
        const result = await whatsappClientService.sendTextMessage(device.phone, body.to, body.message);
        console.log(result);
        if (result.error) {
            throw new HTTP401Error(result.message);
        }
    }

    public async sendImageMessage(body: any, deviceId: string) {
        const device = await this.findDeviceById(deviceId);
        if (!device) throw new HTTP400Error("DEVICE_NOT_FOUND");
        const to = body.to;
        const msg: IImageMessage = { image: body.locationUrl, caption: body.caption || '' };
        const result = await whatsappClientService.sendImageMessage(device.phone, to, msg);
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
        await fileManagement.deleteFile(`${device.phone}_cred.json`);
        const data = await whatsappClientService.logoutClient(device.phone);
        if (data.error) throw new HTTP400Error(data.message);
        // const updateDeviceData ={
        //     authState: false,
        //     reason: {
        //       statusCode: 401,
        //       error: 'Unauthorized',
        //       message: 'Connection Failure'
        //     }
        //   }
        // await this.updateDevice(device.phone,updateDeviceData);
        return { message: "DEVICE_LOGGED_OUT", device: device };
    }

    public async generateNewKey(deviceId: string, body: any) {
        try {
            let expiresIn = null;
            if (body.expiresOn && body.expiresOn != "NEVER") {
                const expiresOn = dayjs(new Date(body.expiresOn));
                const diff = expiresOn.diff(dayjs(), 'day', true);
                expiresIn = `${Math.floor(diff)}d`;
            }
            const totalAvailableKeys = await this.getTotalAvailableApiKeys(deviceId);
            console.log(totalAvailableKeys, process.env.MAX_APIKEY_PER_DEVICE);

            if (totalAvailableKeys < parseInt(process.env.MAX_APIKEY_PER_DEVICE)) {
                console.log("generating new key");
                const token = this.generateDeviceKey(deviceId, expiresIn);
                const tokenData = { token: token, expiresOn: body.expiresOn };
                await this.addNewTokenDataToDevice(deviceId, tokenData);
                console.log(tokenData);
                return tokenData;
            }
            throw new HTTP400Error("MAX_API_KEY_REACHED");
        } catch (err) {
            throw new HTTP400Error(err.message);
        }
    }

    public async getKeys(deviceId: string) {
        const keys = await Device.aggregate([
            { $match: { _id: new ObjectID(deviceId) } },
            {
                $project: {
                    apiKeys: 1
                }
            }
        ]);
        console.log(keys);
        return keys[0]?.apiKeys || null;
    }
    private async addNewTokenDataToDevice(deviceId: string, tokenData: any) {
        const result = await Device.findByIdAndUpdate(deviceId, { $push: { apiKeys: tokenData } }, { "upsert": true, new: true });
        console.log(result);
    }

    private generateDeviceKey(deviceId: string, expiresIn: string) {
        const token = this.signDeviceToken(deviceId, expiresIn);
        return token;
    }

    public signDeviceToken = (deviceId: string, expiresIn: string) => {
        if (!expiresIn) {
            return jwt.sign({ deviceId }, deviceKeyConfig.jwtSecretKey, {});
        }
        return jwt.sign({ deviceId }, deviceKeyConfig.jwtSecretKey, {
            expiresIn: expiresIn,
        });
    };


    private async getTotalAvailableApiKeys(deviceId: string) {
        const result: any = await Device.aggregate([
            { $match: { _id: new ObjectID(deviceId) } },
            {
                $project: {
                    count: { $cond: { if: { $isArray: "$apiKeys" }, then: { $size: "$apiKeys" }, else: 0 } }
                }
            }
        ]);
        console.log(result);

        return result[0].count;
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

    public async findDeviceByUseId(userId: string) {
        const devices = await Device.find({ userId: userId }).lean();
        return devices;
    }

    public async findDeviceByCondition(condition) {
        const data = await Device.aggregate([{
            $match: condition
        }])
        return data;
    }

    public async findDeviceByIdAndUserId(deviceId: string, userId: string) {
        const result = await Device.aggregate([
            {
                $match: { _id: new ObjectID(deviceId), userId: new ObjectID(userId) }
            }, {
                $project: {
                    _id: 1
                }
            }
        ]);
        return result[0] || null;
    }


}

export default new DeviceModel();