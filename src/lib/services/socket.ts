import deviceModel from './../../components/device/device.model';
import { Socket } from "socket.io";
import { schedule } from "node-cron";
import { configCors, rateLimitConfig } from "../../config";
import { io } from "socket.io-client";
import whatsappService from "./whatsapp/whatsapp.service";

let webClient: Socket;
interface QRData {
  error: boolean,
  qr: string,
  reason?: string
}

export class SocketManager {

  public socketServer = async (server: any) => {
    const io = require("socket.io")(server, {
      cors: true,
      origin: configCors.allowOrigin,
    });


    io.on("connection", (socket: Socket) => {
      console.log("socket connected ");
      console.log(socket.id);
      webClient = socket;
      let task: any;
    });

  };

  public sendClientError = (phone: string, error: any) => {
    if (!webClient) return console.log("webClient not connected..");
    webClient.emit(`${phone}_clientError`, { reason: error });
  }
  public sendQrCode = (phone: string, qrData: QRData) => {
    console.log("emittinq qr to ", `${phone}_qr`);

    if (!webClient) return console.log("webClient not connected..");
    webClient.emit(`${phone}_qr`, qrData);
  };

  public sendAuthenticated = (phone: string) => {
    if (!webClient) return console.log("webClient not connected..");
    webClient.emit(`${phone}_authenticated`);
  }

  public sendQrRetryExceed = (data: any) => {
    if (!webClient) return console.log("webClient not connected..");
    console.log("sending qr excedded");

    webClient.emit(`${data.phone}_qr_exceeded`);
  };

  public sendConnectionClosed = (data: any) => {
    if (!webClient) return console.log("webClient not connected..");
    webClient.emit(`${data.phone}_connection_closed`, { reason: data.reason });
  };

  public sendError = (data: any) => {
    if (!webClient) return console.log("webClient not connected..");
    webClient.emit(`${data.phone}_error`, { reason: data.reason });
  };

  public sendLoggedout(data: any) {
    if (!webClient) return console.log("webClient not connected..");
    console.log("sendign logout to ", data);

    webClient.emit(`${data.phone}_LOGGEDOUT`, data);
  }
}


export default new SocketManager();