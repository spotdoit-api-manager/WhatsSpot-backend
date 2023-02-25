import { mailazyConfig } from "./../../config/index";
import dayjs from "dayjs";
import { Device } from "./../../components/device/device.schema";
import whatsappClientService from "./whatsapp/whatsapp-client.service";
import logger from "../utils/logger";
import notifyService from "./notify.service";
export class DeviceMonitor {
  private MAX_LAST_USED = 15;
  public init() {
    logger.info("Device Monitor Started");
    const intervalTime = 24 * 60 * 60 * 1000;
    const interval = setInterval(() => {
        logger.info("Device Monitor Running.....");
      this.unAuthorizeDevices();
    }, intervalTime);
  }

  private async getUnUsedDevices() {
    // get 15 days older date
    const date = dayjs().subtract(this.MAX_LAST_USED, "days");
    const devices = await Device.find({
      $and: [
        {
          lastUsed: {
            $lt: date.toDate(),
          },
        },
        {
          authState: true,
        },
      ],
    });
    return devices;
  }

  private async unAuthorizeDevices() {
    const devices = await this.getUnUsedDevices();
    logger.info(`Found ${devices.length} devices to unAuthorize`);
    devices.forEach(async (device) => {
      logger.info(
        `Device ${device.name} is not used for ${this.MAX_LAST_USED} days, unAuthorizing it`
      );
      await whatsappClientService.logoutClient(device.phone);
      device.authState = false;
      device.reason = {
        statusCode: 401,
        message: "Device is not used for 15 days",
        error: "Device is not used for 15 days",
      };
      await notifyService.deviceUnAuthorizedDueToNotUsed(device._id);
      await device.save();
    });

    logger.info("Device Monitor Finished");
  }
}

export default new DeviceMonitor();
