/* eslint-disable @typescript-eslint/no-var-requires */
import { Socket } from "socket.io";
import { configCors } from "../../config";
import { IMessageProgress } from "../interfaces/socket.interface";
import logger from "../../core/logger";

let webClient: Socket;
interface QRData {
  error: boolean;
  qr: string;
  reason?: string;
}

export class SocketManager {

  public socketServer = async (server: any) => {
    const io = require("socket.io")(server, {
      cors: true,
      origin: configCors.allowOrigin,
    });


    io.on("connection", (socket: Socket) => {
      logger.info("socket connected ");
      logger.info(socket.id);
      webClient = socket;
    });

  };


  public sendClientError = (phone: string, error: any) => {
    if (!webClient) return logger.error("webClient not connected..");
    webClient.emit(`${phone}_clientError`, { reason: error });
  }
  public sendQrCode = (phone: string, qrData: QRData) => {
    logger.info("emittinq qr to ", `${phone}_qr`);

    if (!webClient) return logger.error("webClient not connected..");
    webClient.emit(`${phone}_qr`, qrData);
  };

  public sendAuthenticated = (phone: string) => {
    if (!webClient) return logger.error("webClient not connected..");
    webClient.emit(`${phone}_authenticated`);
  }

  public sendQrRetryExceed = (data: {phone: string}) => {
    if (!webClient) return logger.error("webClient not connected..");
    logger.info("sending qr exceeded");

    webClient.emit(`${data.phone}_qr_exceeded`);
  };

  public sendConnectionClosed = (data: {phone: string;reason: string}) => {
    if (!webClient) return logger.error("webClient not connected..");
    webClient.emit(`${data.phone}_connection_closed`, { reason: data.reason });
  };

  public sendError = (data: {phone: string;reason: string}) => {
    if (!webClient) return logger.error("webClient not connected..");
    webClient.emit(`${data.phone}_error`, { reason: data.reason });
  };

  public sendLoggedOut(data: {phone: string}) {
    if (!webClient) return logger.error("webClient not connected..");
    logger.info("sending logout to ", data);
    webClient.emit(`${data.phone}_LOGGEDOUT`, data);
  }

  public sendFailedMessageSendProgress(deviceId: string,progressData: IMessageProgress) {
    if (!webClient) return logger.error("webClient not connected..");
    logger.info("sending failed message over to ", progressData);
    webClient.emit(`${deviceId}_FAILED_PROGRESS`, progressData);
  }

  public sendFailedMessageSendComplete(data: {deviceId: string}) {
    if (!webClient) return logger.error("webClient not connected..");
    logger.info("sending failed message over to ", data);
    webClient.emit(`${data.deviceId}_FAILED_COMPLETED`, data);
  }
}


export default new SocketManager();