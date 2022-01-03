import deviceModel from './../../components/device/device.model';
import { Socket } from "socket.io";
import { schedule } from "node-cron";
import { configCors, rateLimitConfig } from "../../config";
import { io } from "socket.io-client";
import whatsappService from "./whatsapp/whatsapp.service";

let webClient: Socket;

export const socketServer = async (server: any) => {
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

export const sendClientError = (phone:string,error:any)=>{
  if(!webClient) return console.log("webClient not connected..");
  webClient.emit(`${phone}_clientError`, { reason:error });
}
 export const sendQrCode = (phone: string, qr: string) => {
   if(!webClient) return console.log("webClient not connected..");
   webClient.emit(`${phone}_qr`, { qr });
  };

  export const sendAuthenticated = (phone:string)=>{
    if(!webClient) return console.log("webClient not connected..");
    webClient.emit(`${phone}_authenticated`);
  }

  export const sendQrRetryExceed = (data:any) => {
    if(!webClient) return console.log("webClient not connected..");
    console.log("sending qr excedded");
    
    webClient.emit(`${data.phone}_qr_exceeded`);
   };

   export const sendConnectionClosed = (data:any) => {
    if(!webClient) return console.log("webClient not connected..");
    webClient.emit(`${data.phone}_connection_closed`,{reason:data.reason});
   };

   export const sendError = (data:any) => {
    if(!webClient) return console.log("webClient not connected..");
    webClient.emit(`${data.phone}_error`,{reason:data.reason});
   };