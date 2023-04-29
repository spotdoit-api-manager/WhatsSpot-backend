import planManagerService  from "../../lib/services/plan.manager.service";
import { IScheduleMessageModel, ScheduleMessage } from "./../messages/message.schema";
import { isValidMongoId } from "./../../lib/helpers/index";
import { IWebHook } from "./device.interface";
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { IPlanModel } from "./../plans/plans.schema";
import { mongoDBProjectFields } from "./../../lib/utils/index";
import logger from "../../core/logger";
import {
  EDeviceStatus,
  IDeviceTokenData,
  INewDevice,
} from "../device/device.interface";
import { deviceKeyConfig } from "./../../config/index";
import { EMessageStatus } from "./../messages/message.interface";
import { HTTP400Error, HTTP401Error } from "./../../lib/utils/httpErrors";
import { EApiKeyStatus, IApiKey, IDevice } from "./device.interface";
import { Device, IApiKeyModal, IDeviceModel } from "./device.schema";
import whatsappClientService from "../../lib/services/whatsapp/whatsapp-client.service";
import fileManagement from "../../lib/helpers/file.management";
import messageModel from "../messages/message.model";
import scheduleService from "../../lib/services/schedule.service";

import { ObjectID } from "bson";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";

import * as otpHandler from "../../lib/services/otp-handler";
import userModel from "../user/user.model";
import apiBlockListModel from "../api-blocklist/api-blocklist.model";
import spotSchedular from "../../lib/services/schedular";
import { parsePhoneWithCountry } from "../../lib/utils/phone.handler";
import { deviceProjection } from "../../lib/values/projection.values";
import plansModel from "../plans/plans.model";
import deviceUtils from "./device.utils";
import axios from "axios";
const logFileName = "[DeviceModal] : ";
export class DeviceModel {
  public async newDevice(
    userId: string,
    walletId: string,
    body: IDevice,
    newDeviceCode: string
  ) {
    body.userId = userId;
    await this.isMaxDeviceLimitReached(userId);
    const parsedPhone = parsePhoneWithCountry(body.phone, body.country).number;
    const device = await this.findDeviceByPhone(parsedPhone);
    this.validateDeviceAdd(userId, device);
    await userModel.validateDeviceCode(
      userId,
      parsedPhone,
      parseInt(newDeviceCode)
    );
    logger.info(logFileName, `Device ${parsedPhone} verified`);
    body.phone = parsedPhone;
    const newDevice = new Device(body);
    const newDeviceData: IDeviceModel = await newDevice.saveDevice();
    if (!newDeviceData) throw new HTTP400Error("UNKNOWN_ERROR");
    const expiresOn = dayjs()
      .add(
        parseInt(
          (process.env.DEFAULT_APIKEY_EXPIRYES_IN || "3d").replace("d", "")
        ),
        "day"
      )
      .toDate()
      .toUTCString();
    const keys = await this.generateNewKey(
      userId,
      walletId,
      newDeviceData._id,
      { name: process.env.DEFAULT_APIKEY_NAME, expiresOn }
    );
    return newDeviceData;
  }

  private async isMaxDeviceLimitReached(userId: string) {
    const devices = await Device.find({
      userId: userId,
      "isDeleted.status": false,
    });
    const userPlan = await userModel.fetchUserActivePlan(userId);
    if (userPlan && userPlan.planId) {
      const plan: IPlanModel = (await plansModel.fetchPlanByPlanId(
        userPlan.planId
      )) as IPlanModel;
      if (devices.length >= plan.maxDevices)
        throw new HTTP400Error(
          "MAX_DEVICE_LIMIT_REACHED",
          `You have reached maximum device limit of ${plan.maxDevices} in your ${plan.planName} plan`
        );
    } else {
      if (devices.length >= parseInt(process.env.DEFAULT_MAX_DEVICES || "1"))
        throw new HTTP400Error(
          "MAX_DEVICE_LIMIT_REACHED",
          `You have reached maximum device limit of ${
            process.env.DEFAULT_MAX_DEVICES || "1"
          }`
        );
    }
    return false;
  }

  public async newDeviceCode(
    userId: string,
    walletId: string,
    newDeviceBody: INewDevice
  ) {
    const parsedPhone = parsePhoneWithCountry(
      newDeviceBody.phone,
      newDeviceBody.country
    ).number;
    const device = await this.findDeviceByPhone(parsedPhone);
    this.validateDeviceAdd(userId, device);
    const code = await userModel.updateDeviceCode(userId, parsedPhone);
    const result = await otpHandler.sendNewDeviceCode(parsedPhone, code);
    return result;
  }

  private validateDeviceAdd(userId: string, device: IDevice) {
    if (device && device.userId == userId) return device;
    else if (device && device.userId != userId)
      throw new HTTP401Error(
        "DEVICE_ALREADY_REGISTERD",
        "This device is already added by some user"
      );
  }
  public async getQr(userId: string, deviceId: string) {
    isValidMongoId(deviceId);

    const device = await deviceUtils.findDeviceById(userId, deviceId);
    if (!device) throw new HTTP400Error("DEVICE_NOT_FOUND");
    if (device.authState)
      return { error: true, message: "ALREADY_AUTHENTICATED" };
    // if (!device.authState && device.reason && device.reason.statusCode === DisconnectReason.loggedOut) {
    //     return { message: "DEVICE_LOGGED_OUT" };
    // }
    const data = whatsappClientService.getClientQr(deviceId, device.phone);
    device.lastUsed = new Date();
    await device.save();
    return { message: "QR_REQUESTED" };
  }

  public async removeClient(userId: string, deviceId: string) {
    isValidMongoId(deviceId);

    const device = await deviceUtils.findDeviceById(userId, deviceId);
    if (!device) throw new HTTP400Error("DEVICE_NOT_FOUND");
    const data = whatsappClientService.removeClientInstanceByPhone(
      device.phone
    );
    return { message: "CLIENT_REMOVED" };
  }

  public fetchAllDevices = async (userId: string) => {
    const devices = await this.findDeviceByUseId(userId);
    if (!devices || !devices.length) throw new HTTP400Error("NO_DEVICE_ADDED");
    return devices;
  };
  public fetchDevice = async (deviceId: string, userId: string) => {
    isValidMongoId(deviceId);

    const device = await this.fetchDeviceByCondition(deviceId, userId);
    return device;
  };

  private async fetchDeviceByCondition(deviceId: string, userId: string) {
    isValidMongoId(deviceId);

    const result = await Device.aggregate([
      {
        $match: {
          _id: new ObjectID(deviceId),
          userId: new ObjectID(userId),
          "isDeleted.status": false,
        },
      },
      {
        $project: {
          apiKeys: 0,
        },
      },
    ]);
    return result[0] || null;
  }

  public async fetchDevicesMetrics() {
    const totalDevices = await Device.countDocuments();
    const activeDevices = await Device.countDocuments({ authState: true });
    const deletedDevices = await Device.countDocuments({
      "isDeleted.status": true,
    });
    return { totalDevices, activeDevices, deletedDevices };
  }

  public async fetchPrevMessages(deviceId: string) {
    isValidMongoId(deviceId);
    try {
      const messages = await this.fetchMessagesByStatus(deviceId);
      if (!messages || !messages.length) throw new HTTP400Error("NO_MESSAGES");
      return messages;
    } catch (err) {
      throw new HTTP400Error(err.message);
    }
  }

  private async fetchMessagesByStatus(
    deviceId: string,
    status: EMessageStatus = null
  ) {
    isValidMongoId(deviceId);

    const condition: any = { _id: new ObjectID(deviceId) };
    if (status) condition.status = status;
    const result = await Device.aggregate([
      { $match: condition },
      { $set: { _id: { $toObjectId: "$_id" } } },
      {
        $project: {
          _id: 1,
        },
      },
      {
        $lookup: {
          from: "fastmessages",
          localField: "_id",
          foreignField: "deviceId",
          as: "fastMessages",
        },
      },
      {
        $lookup: {
          from: "messagequeues",
          localField: "_id",
          foreignField: "deviceId",
          as: "queueMessages",
        },
      },
      {
        $project: {
          messages: { $setUnion: ["$fastMessages", "$queueMessages"] },
        },
      },
      { $unwind: "$messages" },

      {
        $sort: {
          "messages.createdAt": -1,
        },
      },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);
    return result[0]?.messages || null;
  }

  public async deleteAuth(userId: string, deviceId: string) {
    isValidMongoId(deviceId);
    const device = await deviceUtils.findDeviceById(userId, deviceId);
    if (!device) throw new HTTP400Error("DEVICE_NOT_FOUND");
    const authFilePath = `${process.env.SESSIONS_FOLDER}/${device.phone}_cred.json`;
    const authFileNew = `${process.env.SESSIONS_FOLDER}/${device.phone}_cred_new`;
    const res: any = await fileManagement.deleteFile(authFilePath);
     await fileManagement.deleteFolder(authFileNew);
    if (res.error) throw new HTTP401Error(res.message);
    await deviceUtils.updateDevice(device._id, { reason: null });
    return { message: "DEVICE_LOGGEDOUT" };
  }

  public async logoutDevice(userId: string, deviceId: string) {
    isValidMongoId(deviceId);

    const device = await deviceUtils.findDeviceById(userId, deviceId);
    if (!device) throw new HTTP400Error("DEVICE_NOT_FOUND");
    const authFilePath = `${process.env.SESSIONS_FOLDER}/${device.phone}_cred.json`;
    await fileManagement.deleteFile(authFilePath);
    const data = await whatsappClientService.logoutClient(device.phone);
    if (data.error) throw new HTTP400Error(data.message);
    device.authState = false;
    device.reason = {
      message: "Logged out",      
    };
    await device.save();

    return { message: "DEVICE_LOGGED_OUT", device: device };
  }


  public async reScheduleMessage(userId: string, scheduleTime: Date, deviceId: string, messageId: string) {
    console.log("deviceId",deviceId," messageId",messageId," userId",userId," scheduleTime",scheduleTime);
    isValidMongoId(deviceId);
    isValidMongoId(messageId);
    try { 
      const newScheduleTime = new Date(scheduleTime);
      if(!newScheduleTime) throw new HTTP400Error("INVALID_SCHEDULE_TIME", "Schedule time is invalid");
      const currentTime = new Date();
      const diff = newScheduleTime.getTime() - currentTime.getTime();
      const preMin = 1;
      if(diff < preMin*60*1000 ) throw new HTTP400Error("INVALID_SCHEDULE_TIME", "Schedule time should be in future and more than 5 minutes");

      const message = await ScheduleMessage.findOne({ _id: messageId, userId, deviceId});
      if (!message) throw new HTTP400Error("MESSAGE_NOT_FOUND");
      message.scheduleTime = newScheduleTime;
      await message.save();
      scheduleService.removeScheduleJob(messageId);
      scheduleService.scheduleMessages([message]);
      return message;
    } catch (err) {
      throw new HTTP400Error(err.message);
    }
  }

  public async fetchScheduledMessages(userId: string, deviceId: string) {
    isValidMongoId(deviceId);
    try {
      // fetch messages from scheduled collection
      const messages: IScheduleMessageModel[] = await ScheduleMessage.find({ userId, deviceId });
      if (!messages || !messages.length) throw new HTTP400Error("NO_MESSAGES");
      return messages;
    } catch (err) {
      throw new HTTP400Error(err.message);
    }
  }

  public async removeScheduledMessage( userId: string, deviceId: string, messageId: string) {
    isValidMongoId(deviceId);
    isValidMongoId(messageId);
    try {
      await ScheduleMessage.deleteOne({ userId, deviceId, _id: messageId });
      scheduleService.removeScheduleJob(messageId);
      return { message: "MESSAGE_DELETED" };
    } catch (err) {
      throw new HTTP400Error(err.message);
    }
  }


  public async generateNewKey(
    userId: string,
    walletId: string,
    deviceId: string,
    body: any
    ) {
      console.log("device id is:",deviceId);
      isValidMongoId(deviceId);
      isValidMongoId(walletId);

    if (!body.name || !body.expiresOn) throw new HTTP400Error("Fields missing");
    console.log(body);
    try {
      let expiresIn = null;
      let expiresOn: any;
      if (body.expiresOn != "NEVER") {
        expiresOn = dayjs(new Date(body.expiresOn));
        const diff = expiresOn.diff(dayjs(), "day", true);
        expiresIn = `${Math.floor(diff)}d`;
      } else {
        expiresOn = dayjs();
        expiresOn = expiresOn.add(50, "year");
      }
      const totalAvailableKeys = await this.getTotalAvailableApiKeys(deviceId);

      if (totalAvailableKeys < parseInt(process.env.MAX_APIKEY_PER_DEVICE)) {
        const apiKeyData: IDeviceTokenData = { walletId, userId, deviceId };
        const token = this.generateDeviceKey(apiKeyData, expiresIn);
        const tokenData: IApiKey = {
          name: body.name,
          createdOn: new Date(),
          token: token,
          expiresOn: expiresOn?.toDate(),
          status: { status: EApiKeyStatus.ACTIVE, reason: null },
        };
        await this.addNewTokenDataToDevice(deviceId.toString(), tokenData);
        return tokenData;
      }
      throw new HTTP400Error("MAX_API_KEY_REACHED");
    } catch (err) {
      throw new HTTP400Error(err.message);
    }
  }

  public async deleteKey(deviceId: string, keyId: string) {
    isValidMongoId(deviceId);

    try {
      const result = await Device.findOneAndUpdate(
        { _id: new ObjectID(deviceId) },
        { $pull: { apiKeys: { _id: new ObjectID(keyId) } } },
        { upsert: false, new: false }
      ).lean();
      const apiData = result.apiKeys.find(
        (x: IApiKeyModal) => x._id.toString() === keyId
      ) as any;
      if (apiData.status !== EApiKeyStatus.EXPIRED) {
        await apiBlockListModel.addApiToBlockList(deviceId, apiData);
      }
    } catch (err) {
      throw new HTTP400Error(err.message);
    }
  }

  public async getKeys(deviceId: string) {
    const keys = await Device.aggregate([
      { $match: { _id: new ObjectID(deviceId) } },
      {
        $project: {
          apiKeys: 1,
        },
      },
    ]);

    return keys[0]?.apiKeys || null;
  }
  private async addNewTokenDataToDevice(deviceId: string, tokenData: IApiKey) {
    isValidMongoId(deviceId);

    const result = (await Device.findByIdAndUpdate(
      deviceId,
      { $push: { apiKeys: tokenData } },
      { upsert: true, new: true }
    ).lean()) as IDeviceModel;
    await spotSchedular.scheduleApiExpiration(
      deviceId,
      result.apiKeys[result.apiKeys.length - 1] as IApiKeyModal
    );
  }

  private generateDeviceKey(apiKeyData: IDeviceTokenData, expiresIn: string) {
    const token = this.signDeviceToken(apiKeyData, expiresIn);
    return token;
  }

  public signDeviceToken = (
    apiKeyData: IDeviceTokenData,
    expiresIn: string
  ) => {
    if (!expiresIn) {
      return jwt.sign(apiKeyData, deviceKeyConfig.jwtSecretKey, {});
    }
    return jwt.sign(apiKeyData, deviceKeyConfig.jwtSecretKey, {
      expiresIn: expiresIn,
    });
  };

  private async getTotalAvailableApiKeys(deviceId: string) {
    isValidMongoId(deviceId);

    const result: any = await Device.aggregate([
      { $match: { _id: new ObjectID(deviceId) } },
      {
        $project: {
          count: {
            $cond: {
              if: { $isArray: "$apiKeys" },
              then: { $size: "$apiKeys" },
              else: 0,
            },
          },
        },
      },
    ]);
    return result[0].count;
  }

  public async findDeviceByPhone(phone: string) {
    const device = await Device.findOne({ phone, "isDeleted.status": false });
    return device;
  }

  public async findDeviceByUseId(userId: string) {
    const devices = await Device.find({
      userId: userId,
      "isDeleted.status": false,
    }).lean();
    return devices;
  }

  public async findDeviceByIdAndUserId(deviceId: string, userId: string) {
    const result = await Device.aggregate([
      {
        $match: { _id: new ObjectID(deviceId), userId: new ObjectID(userId) },
      },
      {
        $project: {
          _id: 1,
        },
      },
    ]);
    return result[0] || null;
  }

  public async fetchDeviceMetrics(deviceId: string) {
    try {
      const condition = {
        _id: new ObjectID(deviceId),
        "isDeleted.status": false,
      };

      let result = await Device.aggregate([
        { $match: condition },
        { $set: { _id: { $toObjectId: "$_id" } } },

        {
          $lookup: {
            from: "fastmessages",
            localField: "_id",
            foreignField: "deviceId",
            as: "fastMessages",
          },
        },
        {
          $lookup: {
            from: "messagequeues",
            localField: "_id",
            foreignField: "deviceId",
            as: "queueMessages",
          },
        },
        {
          $project: {
            _id: 0,
            messageMetrics: {
              totalFastError: {
                $size: {
                  $filter: {
                    input: "$fastMessages",
                    as: "fastMessage",
                    cond: {
                      $eq: ["$$fastMessage.status", EMessageStatus.ERROR],
                    },
                  },
                },
              },
              totalFastSuccess: {
                $size: {
                  $filter: {
                    input: "$fastMessages",
                    as: "fastMessage",
                    cond: {
                      $eq: ["$$fastMessage.status", EMessageStatus.SENT],
                    },
                  },
                },
              },
              totalQueueSuccess: {
                $size: {
                  $filter: {
                    input: "$queueMessages",
                    as: "queueMessage",
                    cond: {
                      $eq: ["$$queueMessage.status", EMessageStatus.SENT],
                    },
                  },
                },
              },
              totalQueueError: {
                $size: {
                  $filter: {
                    input: "$queueMessages",
                    as: "queueMessage",
                    cond: {
                      $eq: ["$$queueMessage.status", EMessageStatus.ERROR],
                    },
                  },
                },
              },
              totalQueuePending: {
                $size: {
                  $filter: {
                    input: "$queueMessages",
                    as: "queueMessage",
                    cond: {
                      $eq: ["$$queueMessage.status", EMessageStatus.PENDING],
                    },
                  },
                },
              },
            },
            messages: {
              fastMessages: "$fastMessages",
              queueMessages: "$queueMessages",
            },

            deviceInfo: {
              deviceId: "$_id",
              isDeleted: "$isDeleted",
              phone: "$phone",
              name: "$name",
              userId: "$userId",
              createdAt: "$createdAt",
              updatedAt: "$updatedAt",
              authState: "$authState",
              reason: "$reason",
            },
          },
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
              totalQueueSuccess: 0,
            },
          },
        ];
      }
      return result[0];
    } catch (err) {
      console.log(err);
      throw new HTTP400Error(err.messages);
    }
  }

  public async retryFailedMessage(userId: string, deviceId: string) {
    isValidMongoId(deviceId);

    const result: any = await messageModel.retryFailedMessage(userId, deviceId);
    if (result.error) throw new HTTP401Error(result.message);
    return {
      error: false,
      message: "RETRY_REQUESTED",
      messageCount: result.messageCount,
    };
  }

  public async updateDeviceStatus(deviceId: string, status: EDeviceStatus) {
    isValidMongoId(deviceId);

    const result = await Device.findByIdAndUpdate(deviceId, {
      deviceStatus: status,
    });
    return result;
  }

  public async removeDevice(userId: string, deviceId: string) {
    isValidMongoId(deviceId);

    await this.logoutDevice(userId, deviceId);
    const result = await Device.findByIdAndUpdate(deviceId, {
      isDeleted: { status: true, deletedAt: new Date() },
    });
  }

  public async getDeviceStatus(userId: string, deviceId: string) {
    isValidMongoId(deviceId);
    const device = await Device.findOne({
      userId: userId,
      _id: deviceId,
      isDeleted: { status: false },
    });
    if (!device) throw new HTTP400Error("DEVICE_NOT_FOUND");

    return whatsappClientService.getClientStatus(device.phone);
  }

  public async addWebHook(userId: string,walletId:string, deviceId: string, url: string) {
    isValidMongoId(deviceId);
    if (!url) throw new HTTP400Error("URL_REQUIRED");
    await this.validateWebHook(userId, deviceId, url);
    const device = await Device.findOne({})
      .where("userId")
      .equals(userId)
      .where("_id")
      .equals(deviceId)
      .where("isDeleted.status")
      .equals(false);
    if (!device) throw new HTTP400Error("DEVICE_NOT_FOUND");
    const result = device.webHooks.find((webHook) => webHook.url === url && !webHook?.isDeleted);
    if (result) throw new HTTP400Error("Webhook URL already exists");
    device.webHooks.push({ url: url, status: true });
    const updatedDevice = await device.save();
    whatsappClientService.subscribeNewWebHook(
      userId,
      walletId,
      updatedDevice.webHooks[updatedDevice.webHooks.length - 1],
      device.phone
    );
    return device.webHooks[device.webHooks.length - 1];
  }

  public async removeWebHook(
    userId: string,
    walletId:string,
    deviceId: string,
    webHookId: string
  ) {
    isValidMongoId(deviceId);
    isValidMongoId(webHookId);
    const device = await Device.findOne({})
      .where("userId")
      .equals(userId)
      .where("_id")
      .equals(deviceId)
      .where("isDeleted.status")
      .equals(false);
    if (!device) throw new HTTP400Error("DEVICE_NOT_FOUND");
    //remove webHook from device
    const webHook = device.webHooks.find(
      (webHook: IWebHook) => webHook._id.toString() === webHookId
    );
    if (!webHook) throw new HTTP400Error("WEBHOOK_NOT_FOUND");
    webHook.status = false;
    webHook.isDeleted = true;

    await device.save();
    //unsubscribe webHook from whatsapp client
    whatsappClientService.unsubscribeWebHook(userId,walletId,device.webHooks, device.phone);
    return webHook;
  }

  public async pauseWebHook(
    userId: string,
    walletId:string,
    deviceId: string,
    webHookId: string
  ) {
    isValidMongoId(deviceId);
    isValidMongoId(webHookId);
    console.log("pauseWebHook");
    const device = await Device.findOne({})
      .where("userId")
      .equals(userId)
      .where("_id")
      .equals(deviceId)
      .where("isDeleted.status")
      .equals(false);
    if (!device) throw new HTTP400Error("DEVICE_NOT_FOUND");
    const webHook = device.webHooks.find(
      (webHook: IWebHook) => webHook._id.toString() === webHookId
    );
    if (!webHook) throw new HTTP400Error("WEBHOOK_NOT_FOUND");
    webHook.status = false;
    await device.save();
    //unsubscribe webHook from whatsapp client
    console.log(device.webHooks, device.phone);
    whatsappClientService.unsubscribeWebHook(userId,walletId,device.webHooks, device.phone);
    console.log("pauseWebHook");
    return webHook;
  }

  public async resumeWebHook(
    userId: string,
    walletId:string,
    deviceId: string,
    webHookId: string
  ) {
    isValidMongoId(deviceId);
    isValidMongoId(webHookId);
    const device = await Device.findOne({})
      .where("userId")
      .equals(userId)
      .where("_id")
      .equals(deviceId)
      .where("isDeleted.status")
      .equals(false);
    if (!device) throw new HTTP400Error("DEVICE_NOT_FOUND");
    const webHook = device.webHooks.find(
      (webHook: IWebHook) => webHook._id.toString() === webHookId
    );
    if (!webHook) throw new HTTP400Error("WEBHOOK_NOT_FOUND");
    const {hasActivePlan,isMessageOver} = await planManagerService.hasActivePlan(userId);
    if(!hasActivePlan || isMessageOver){ 
      webHook.status = false;
      webHook.reason = "No active plan found or message limit exceeded for this plan";
      await device.save();
      throw new HTTP400Error("No active plan found or message limit exceeded for this plan","Webhook requires active plan to resume");
    }
   
    webHook.status = true;
    webHook.reason = "";
    await device.save();
    //unsubscribe webHook from whatsapp client
    whatsappClientService.subscribeNewWebHook(userId,walletId,webHook, device.phone);
    return webHook;
  }

  public async fetchWebHooks(userId: string, deviceId: string) {
    isValidMongoId(deviceId);
    const device = await Device.findOne({})
      .where("userId")
      .equals(userId)
      .where("_id")
      .equals(deviceId);
    if (!device) throw new HTTP400Error("DEVICE_NOT_FOUND");
    return device.webHooks.filter(
      (webHook: IWebHook) => webHook.isDeleted == false
    );
  }

  public fetchDevicesList() {
    return Device.find({}).select(deviceProjection).lean();
  }

  public getDevicesByAuthState(authState: boolean) {
    return Device.find({ authState: authState }).select(deviceProjection).lean();
  }
  private async validateWebHook(userId: string, deviceId: string, url: string) {
    try {
      //check if url string is valid url using regex
      const regex = new RegExp(/^(http|https):\/\/[a-zA-Z0-9-\.]+\.[a-z]{2,4}/);
      if (!regex.test(url)) throw new HTTP400Error("INVALID_WEBHOOK_URL");
      //make http request to url and check if it is valid
      const result = await axios.post(url, {});
      // get error message
      const errorMessage =
        result?.data?.message ||
        result?.data?.error ||
        result?.data?.errorMessage ||
        "INVALID_WEBHOOK_URL";
      if (result.status !== 200) throw new HTTP400Error(errorMessage);
    } catch (err) {
      throw new HTTP400Error("Webhook url is not valid: " + err.message);
    }
  }
}

export default new DeviceModel();
