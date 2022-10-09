/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ObjectID } from "bson";
import { Device } from "./device.schema";

export class DeviceUtils{
    public async findDeviceById(userId: string, deviceId: string) {
        const device = await Device.findOne({ userId: userId, _id: deviceId, "isDeleted.status": false });
        return device;
    }

    public async findDeviceByCondition(condition) {
        const data = await Device.aggregate([{
            $match: condition
        }]);
        return data;
    }

    public async updateDevice(deviceId: string, clientData: any) {
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const client = await Device.findByIdAndUpdate(deviceId, { ...clientData }, options);
        if (!client) return { error: true, message: "some error occurred" };
        return { error: false };
    }

}

export default new DeviceUtils();