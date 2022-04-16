import logger from '../../core/logger';
import { EDeviceStatus, IDeviceTokenData, INewDevice } from '../device/device.interface';
import { MessageQueue } from './../messages/message.schema';
import { deviceKeyConfig } from './../../config/index';
import { IImageMessage } from './../../lib/services/whatsapp/whatsapp.interface';
import { EMessageStatus, ESendType, IMessage } from './../messages/message.interface';
import { HTTP400Error, HTTP401Error } from './../../lib/utils/httpErrors';
import { EApiKeyStatus, IApiKey, IDevice, TextMessage } from "./device.interface";
import { Device, IDeviceModel } from "./device.shema";
import whatsappClientService from '../../lib/services/whatsapp/whatsapp-client.service';
import fileManagement from '../../lib/helpers/file.management';
import messageModel from '../messages/message.model';
import { ObjectID } from 'bson';
import jwt from 'jsonwebtoken';
import dayjs from 'dayjs'
import { sanatizeMobile, validateMobile } from '../../lib/utils';
import * as otpHandler from '../../lib/services/otp-handler';

const logFileName = "[DeviceModal] : ";
export class DeviceModel {
    public async newDevice(userId:string,walletId:string,body: IDevice,newDeviceCode:string) {
        body.userId = userId;
        const device = await this.findDeviceByPhone(body.phone);
        this.validateDeviceAdd(userId,device);
        await this.verifyNewDeviceCode(newDeviceCode);
        logger.info(logFileName,`Device ${body.phone} verified`);
        const newDevice = new Device(body);
        const newDeviceData:IDeviceModel = await newDevice.saveDevice();
        if(!newDeviceData) throw new HTTP400Error("UNKNOWN_ERROR");
        let expiresOn = dayjs().add(parseInt((process.env.DEFAULT_APIKEY_EXPIRYES_IN || '3d').replace("d", "")), 'day').toDate().toUTCString();;
        const keys = await this.generateNewKey(userId,walletId,newDeviceData._id,{name:process.env.DEFAULT_APIKEY_NAME,expiresOn});
        return newDeviceData;
    }

    public async verifyNewDeviceCode(newDeviceCode:string){
        if(newDeviceCode){
            return true;
        }
        return false;
    }

    public async newDeviceCode(userId:string,walletId:string,newDeviceBody:INewDevice){
        const device = await this.findDeviceByPhone(newDeviceBody.phone);
        this.validateDeviceAdd(userId,device);
        const result  =  await otpHandler.sendNewDeviceCode(newDeviceBody.name);
        return result;
    }


  

    private validateDeviceAdd(userId:string,device:IDevice){
        if (device && device.userId == userId) return device;
        else if(device && device.userId != userId) throw new HTTP401Error("DEVICE_ALREADY_REGISTERD","This device is already added by some user");
    }
    public async getQr(body: any) {
        const device = await this.findDeviceById(body.deviceId);
        if (!device) throw new HTTP400Error("DEVICE_NOT_FOUND");
        if (device.authState) return { error: true, message: "ALREADY_AUTHENTICATED" };
        // if (!device.authState && device.reason && device.reason.statusCode === DisconnectReason.loggedOut) {
        //     return { message: "DEVICE_LOGGED_OUT" };
        // }
        const data = whatsappClientService.getClientQr(device.phone);
        return { message: "QR_REQUESTED" };
    };

    public async removeClient(body:any){
        const device = await this.findDeviceById(body.deviceId);
        if (!device) throw new HTTP400Error("DEVICE_NOT_FOUND");
        const data = whatsappClientService.removeClientInstanceByPhone(device.phone);
        return { message: "CLIENT_REMOVED" };
    }

    public fetchAllDevices = async (userId: string) => {
        const devices = await this.findDeviceByUseId(userId);
        if (!devices || !devices.length) throw new HTTP400Error("NO_DEVICE_ADDED");
        return devices;
    }
    public fetchDevice = async (deviceId: string, userId: string) => {
        const device = await this.fetchDeviceByCondition(deviceId, userId);
        return device;
    }

    private async fetchDeviceByCondition(deviceId: string, userId: string) {
        const result = await Device.aggregate([
            { $match: { _id: new ObjectID(deviceId), userId: new ObjectID(userId) } },
            {
                $project: {
                    apiKeys: 0
                }
            }
        ]);
        return result[0] || null;
    }

   

  

    public async fetchPrevMessages(deviceId: string) {
        try {
            const messages = await this.fetchMessagesByStatus(deviceId);
            if (!messages || !messages.length) throw new HTTP400Error("NO_MESSAGES");
            return messages;
        } catch (err) {
            throw new HTTP400Error(err.message);
        }
    }

    private async fetchMessagesByStatus(deviceId: string, status: EMessageStatus = null) {
        let condition: any = { _id: new ObjectID(deviceId) };
        // if (status) condition.status = status;
        const result = await Device.aggregate([
            { $match: condition },
            { $set: { _id: { $toObjectId: "$_id" } } },
            {
                $project: {
                    _id: 1
                }
            },
            {
                $lookup: {
                    from: "fastmessages",
                    localField: "_id",
                    foreignField: "deviceId",
                    as: "fastMessages"
                },

            },
            {
                $lookup: {
                    from: "messagequeues",
                    localField: "_id",
                    foreignField: "deviceId",
                    as: "queueMessages"
                },

            },
            {
                $project: {
                    messages: { $setUnion: ["$fastMessages", "$queueMessages"] }
                }
            },
            { $unwind: '$messages' },

            {
                $sort: {
                    "messages.createdAt": -1
                }
            },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
           
        ]);
        return result[0]?.messages || null;
    }


    public async deleteAuth(body: any) {
        const device = await this.findDeviceById(body.deviceId);
        if (!device) throw new HTTP400Error("DEVICE_NOT_FOUND");
        const authFilePath = `${process.env.SESSIONS_FOLDER}/${device.phone}_cred.json`;
        const res:any = await fileManagement.deleteFile(authFilePath);
        if(res.error) throw new HTTP401Error(res.message);
        await this.updateDevice(device.phone, { reason: null });
        return { message: "DEVICE_LOGGEDOUT" };
    };

    public async logoutDevice(body: any) {
        const device = await this.findDeviceById(body.deviceId);
        if (!device) throw new HTTP400Error("DEVICE_NOT_FOUND");
        const authFilePath = `${process.env.SESSIONS_FOLDER}/${device.phone}_cred.json`;

        await fileManagement.deleteFile(authFilePath);
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

    public async generateNewKey(userId:string,walletId:string,deviceId: string, body: any) {
        if (!body.name || !body.expiresOn) throw new HTTP400Error("Fields missing");
        try {
            let expiresIn = null;
            if (body.expiresOn != "NEVER") {
                const expiresOn = dayjs(new Date(body.expiresOn));
                const diff = expiresOn.diff(dayjs(), 'day', true);
                expiresIn = `${Math.floor(diff)}d`;
            }
            const totalAvailableKeys = await this.getTotalAvailableApiKeys(deviceId);

            if (totalAvailableKeys < parseInt(process.env.MAX_APIKEY_PER_DEVICE)) {
                const apiKeyData:IDeviceTokenData = {walletId,userId,deviceId}
                const token = this.generateDeviceKey(apiKeyData, expiresIn);
                const tokenData:IApiKey = { name: body.name, createdOn: new Date(), token: token, expiresOn: body.expiresOn, status: { status: EApiKeyStatus.ACTIVE, reason: null } };
                await this.addNewTokenDataToDevice(deviceId, tokenData);
                return tokenData;
            }
            throw new HTTP400Error("MAX_API_KEY_REACHED");
        } catch (err) {
            throw new HTTP400Error(err.message);
        }
    }

    public async deleteKey(deviceId: string, keyId: string) {
        try {
            const result = await Device.updateOne({ _id: deviceId }, { $pull: { apiKeys: { _id: keyId } } });

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

        return keys[0]?.apiKeys || null;
    }
    private async addNewTokenDataToDevice(deviceId: string, tokenData: any) {
        const result = await Device.findByIdAndUpdate(deviceId, { $push: { apiKeys: tokenData } }, { "upsert": true, new: true });
    }

    private generateDeviceKey(apiKeyData: IDeviceTokenData, expiresIn: string) {
        const token = this.signDeviceToken(apiKeyData, expiresIn);
        return token;
    }

    public signDeviceToken = (apiKeyData: IDeviceTokenData, expiresIn: string) => {        
        if (!expiresIn) {
            return jwt.sign(apiKeyData, deviceKeyConfig.jwtSecretKey, {});
        }
        return jwt.sign(apiKeyData, deviceKeyConfig.jwtSecretKey, {
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
        return result[0].count;
    }
    public async updateDevice(phone: string, clientData: any) {
        if (!phone) return  { error: true, message: "phone not provided in client update" };
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

    public async fetchDeviceMetrics(deviceId: string) {
        try {
            const condition = { _id: new ObjectID(deviceId) };

            let result = await Device.aggregate([
                { $match: condition },
                { $set: { _id: { $toObjectId: "$_id" } } },
                {
                    $project: {
                        _id: 1
                    }
                },
                {
                    $lookup: {
                        from: "fastmessages",
                        localField: "_id",
                        foreignField: "deviceId",
                        as: "fastMessages"
                    },

                },
                {
                    $lookup: {
                        from: "messagequeues",
                        localField: "_id",
                        foreignField: "deviceId",
                        as: "queueMessages"
                    },

                },
                {
                    $project: {
                        messageMetrics: {
                            totalFastError: {
                                $size: {
                                    $filter: {
                                        input: "$fastMessages",
                                        as: "fastMessage",
                                        cond: { "$eq": ["$$fastMessage.status", EMessageStatus.ERROR] }
                                    }
                                }
                            },
                            totalFastSuccess: {
                                $size: {
                                    $filter: {
                                        input: "$fastMessages",
                                        as: "fastMessage",
                                        cond: { "$eq": ["$$fastMessage.status", EMessageStatus.SENT] }
                                    }
                                }
                            },
                            totalQueueSuccess: {
                                $size: {
                                    $filter: {
                                        input: "$queueMessages",
                                        as: "queueMessage",
                                        cond: { "$eq": ["$$queueMessage.status", EMessageStatus.SENT] }
                                    }
                                }
                            },
                            totalQueueError: {
                                $size: {
                                    $filter: {
                                        input: "$queueMessages",
                                        as: "queueMessage",
                                        cond: { "$eq": ["$$queueMessage.status", EMessageStatus.ERROR] }
                                    }
                                }
                            },
                            totalQueuePending: {
                                $size: {
                                    $filter: {
                                        input: "$queueMessages",
                                        as: "queueMessage",
                                        cond: { "$eq": ["$$queueMessage.status", EMessageStatus.PENDING] }
                                    }
                                }
                            }
                        }
                    }
                },
            ]);
            if (!result || !result[0]) {
                result = [
                    {
                        messageMetrics: {
                            totalFastError: 1,
                            totalFastSuccess: 3,
                            totalQueueError: 0,
                            totalQueuePending: 2,
                            totalQueueSuccess: 0
                        }
                    }
                ]
            };
            return result[0];
        } catch (err) {
            console.log(err);
            throw new HTTP400Error(err.messages);
        }

    }


    public async retryFailedMessage(userId:string,deviceId:string){
        const result:any = await  messageModel.retryFailedMessage(userId,deviceId);
        if(result.error) throw new HTTP401Error(result.message);
        return {error:false,message:"RETRY_REQUESTED",messageCount:result.messageCount};
    }

    public async updateDeviceStatus(deviceId:string,status:EDeviceStatus){
        const result = await Device.findByIdAndUpdate(deviceId,{deviceStatus:status})
        return result;
    }


}

export default new DeviceModel();