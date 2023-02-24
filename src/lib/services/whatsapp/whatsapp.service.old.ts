/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { getSerializedPhone } from "./whatsapp-utils";
import {  IReason, IWhatsappMessage, IWhatsappTextMessage } from "./whatsapp.interface";
import { EventEmitter } from "events";
import P from "pino";
import { Boom } from "@hapi/boom";
import makeWASocket, {
  DisconnectReason,
  delay,
  useSingleFileAuthState,
  AuthenticationState,
  
} from "@baileys/old";

import path from "path";
import instanceProviderOld from "./instance.provider.old";
import logger from "../../../core/logger";
import notifyService from "../notify.service";
import fileManagement from "../../../lib/helpers/file.management";
import { EWhatsappMessageTypes } from "./whatsapp.enum";
import deviceUtils from "../../../components/device/device.utils";

const logFileName = "[WhatsappService] : ";
const refreshInterval = 1800; //in seconds
export default class WhatsappOld extends EventEmitter {
  private  logger = P({});

  client: any;
  phone: string;
  deviceId: string;
  state: AuthenticationState;
  saveState: any;
  public authState = false;
  qrInProcess =false;
  qrRequested = false;
  public _instanceId: number;
  private retryCount =0;
  private removed =false;
  private firstConnect = false;

  
// private interval;
  constructor(deviceId: string,phone: string) {
    super();
    this.logger.level = "trace";
    console.log(".............................................OLD WHATSAPPPPP--------------------------");
    this._instanceId = instanceProviderOld.addInstance(this);
    // this.state = useSingleFileAuthState(`${process.env.SESSIONS_FOLDER}/s/${phone}_cred.json`).state;
    // this.saveState = useSingleFileAuthState(`${process.env.SESSIONS_FOLDER}/${phone}_cred.json`).saveState;
    this.phone = phone;
    this.deviceId = deviceId;
//     this.initRefreshInterval();
  }
//   private initRefreshInterval(){
//     this.interval = setInterval(()=>{
//       logger.info(logFileName,`[${this.phone}] Refreshing Client`);
//       this.getDeviceStatus();
//     },refreshInterval*1000);
//   }

//   private closeRefreshInterval(){
//     if(this.interval){
//       logger.info(logFileName,`[${this.phone}] Closing Refresh Interval`);
//       clearInterval(this.interval);
//     }
//   }
//   // start a connection
//   public initiClient = async (notify:boolean=true) => {
//     this.firstConnect = !notify;
//     // if(!this.qrRequested) return;
//     try {
//       const config: any ={
//         logger: P({ level: "info" }), //silent
//         printQRInTerminal: false,
//         auth: this.state,
//         browser:["Mac OS", "Chrome", "10.15.3"],
//         downloadHistory: false,
//         version: [2,2204,13],
//       } ;
//       const sock = makeWASocket(config);
//       this.client = sock;
//       this.startBasicEventListners();
//       await this.client.waitForSocketOpen();
//       return { error: false };
//     } catch (err) {
//       return { error: true, message: err.message };
//     }
//   };

//   public getQr = async () => {
//     this.qrRequested = true;
//     if(this.qrInProcess) return;
//     this.qrInProcess = true;
//     this.client.ev.on("connection.update", async (update: any) => {
//       try {
//         const { connection, lastDisconnect, qr } = update;
//         if (connection === "connecting") return;
//         if (qr) {
//           this.emit("qr", { qr: update.qr, error: false });
//           return;
//         }
//         if (this.checkIfQrRetryExceeded(lastDisconnect)) {
//           this.emit("qr", { error: true, message: "QR_RETRY_EXCEEDED" });
//           this.qrRequested = true;
//           this.qrInProcess = false;
//           this.client.ev.removeAllListeners();
//           return;
//         }
//       } catch (err) {
//         logger.error(logFileName,err);
//       }
//     });
//   };

//   private checkIfQrRetryExceeded(lastDisconnect) {
//     if (lastDisconnect && (lastDisconnect.error as Boom)?.output?.payload.message ==
//       "QR refs attempts ended") {
//       return true;
//     }
//     false;
//   }

//   private startBasicEventListners() {
//     // this.client.ev.removeAllListeners();
//     //cred update listner
//     this.client.ev.on("creds.update", this.saveState);

//     //connection update
//     this.client.ev.on("connection.update", async (update: any) => {
//       try {
//         const { connection, lastDisconnect } = update;
//         if(connection=="connecting") return;
//         if (connection === "open") await this.handleConnectionOpen();
//         else if (connection === "close") this.handleConnectionClose(lastDisconnect);
//         else{
//           const reason: IReason = this.getDisconnectReason(lastDisconnect);
//           logger.debug(logFileName,"connection update (not open| not close)", update, reason);
//           if(update.qr){
//             this.updateDeviceStatus(false,reason);
//           }

//           this.qrInProcess = true;
//         }
//       } catch (err) {
//         logger.error(logFileName,`Error in handling connection Update ${this.phone}`,err);
//       }
//     });

//     // message upsert
//     this.client.ev.on("messages.upsert", async (m: any) => {
//       try {
//         const msg = m.messages[0];
//         // console.log("msg",JSON.stringify(msg,null,2));
//         if (!msg.key.fromMe) {
//           if(!msg.message?.conversation && !msg.message.extendedTextMessage)return;
//           const msgText = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
//           logger.info(logFileName,`received msg :${msgText}`);
//           logger.info(logFileName,`From: ${msg.key.remoteJid}`);
//           if(msgText){//if it is text type message
//             this.emit("NEW_MESSAGE", msg);
//           }
//         } else {
//           logger.info(logFileName,`sent msg :${JSON.stringify(msg.message)}`);
//           logger.info(logFileName,`to: ${msg.key.remoteJid}`);
//         }
       
//       } catch (err) {
//         logger.error(logFileName,`Error in message upsert for client ${this.phone}`,err);
//       }
//     });
//   }

//   private isMaxRetryReached(){
//     if(this.retryCount>parseInt(process.env.MAX_WHATSAPP_RETRY)){
//       this.client.ev.removeAllListeners();
//       return true;
//     }
//     return false;
//   }

//   private async reconnectClient() {
//     logger.warn("RETRYING CONNECTION..", this.phone);
//     this.retryCount++;
//     if(this.isMaxRetryReached()){
//       this.retryCount = 0;
//       logger.warn(logFileName,`[${this.phone}] Max Connection Retry Reached....`);
//       notifyService.deviceMaxRetryReached(this.deviceId);
//       // this.destroyClient();
//       return;
//     }

//     this.client.ev.removeAllListeners();
//     await this.initiClient();
//   }

//   private getDisconnectReason(lastDisconnect){
//     let reason = null;
//     if (lastDisconnect && (lastDisconnect.error as Boom)?.output.payload) {
//       reason = (lastDisconnect.error as Boom)?.output.payload;
//     }
//     return reason;
//   }

//   private destroyClient(){
//     return;
//   }

//   public async getDeviceStatus(){
//     try{ 
//        await this.client.sendPresenceUpdate("available", getSerializedPhone("919099858434"));
//        return {status:true};
//     }catch(e){
//       console.log(e.message);
//       if(e.message == "Connection Closed"){
//         return this.reconnectClient();
//       }
//       await deviceUtils.updateDevice(this.deviceId, {
//         authState: false, reason:e.message
//       });
//       return {status:false};
//     }

//   }
//   private async handleConnectionOpen(){
//      logger.info(logFileName,"CONNECTION_OPENED");
//     this.qrRequested = true;
//     this.qrInProcess = false;
//     this.emit("authenticated", { phone: this.phone });
//      deviceUtils.updateDevice(this.deviceId, {
//       authState: true, reason: null
//     });
//       if(!this.firstConnect && !this.authState){
//         this.firstConnect = false;
//         notifyService.deviceAuthorized(this.deviceId);
//       }
//      this.authState = true;
//   }

//   private async deleteAuthFile(){
//     try{
//       const authFilePath = `${process.env.SESSIONS_FOLDER}/${this.phone}_cred.json`;
//       await fileManagement.deleteFile(authFilePath);
//     }catch(e){
//       logger.error(`Error in deleting auth file for ${this.phone}: `,e);
//     }
//   }

//   private async handleConnectionClose(lastDisconnect){
//     const shouldReconnect = (lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
//     if (shouldReconnect) {
//       logger.warn(logFileName,"CONNECTION_CLOSED (NOT_LOGGED_OUT) Retrying......");
//       this.authState = false;

//       return await this.reconnectClient();
//     }
//     else {
//       const reason = this.getDisconnectReason(lastDisconnect);
//       this.deleteAuthFile();
//       await deviceUtils.updateDevice(this.deviceId, {
//         authState: false, reason
//       });
//       this.authState = false;
//       notifyService.deviceConnectionClosed(this.deviceId,reason);

//       this.qrInProcess = false;
//       this.qrRequested = false;
//       logger.warn(logFileName,"CONNECTION_CLOSED (LOGGEDOUT)", reason, this.phone);
//       this.emit("LOGGEDOUT", { phone: this.phone, reason: reason?.message });
//       this.closeRefreshInterval();
//     }
//   }

//   private async updateDeviceStatus(authState: boolean,reason: IReason){
//     if(!this.removed){

//       return await deviceUtils.updateDevice(this.deviceId, {
//         authState, reason
//       });
//     }else{
//      logger.warn(logFileName,"tried to update Device Status but device is removed",authState,reason);
//     }
//   }
  
//   public sendAnyMessage = async (
//     to: string,
//     msg: IWhatsappMessage
//   ) => {
//     try {
//       const jid = getSerializedPhone(to);
//       await this.client.presenceSubscribe(jid);
//       await delay(500);
//       const result = await this.client.sendMessage(jid, {
//         ...msg, detectLinks: true,
//       });
//       logger.debug(logFileName,`Sent  Result client ${this.phone} :`,result);

//       if (result.status != 1) {
//         return { error: true };
//       }
//       return { error: false };
//     } catch (e) {
//       logger.error(logFileName,`Sent Error client ${this.phone} :`,e);

//       return { error: true, message: e.message };
//     }
//   };


//   public endClient() {
//     // this.client.
//     this.removed=true;
//     this.client.end();
  

//   }

//   public async logoutClient() {
//     try{
//       await this.client.logout();
//       return {error:false};
//     }catch(e){
//       return {error:true,message:e.message};
//     }

//   }

  // startSock()
}

instanceProviderOld.addClass(WhatsappOld);

// export default new Whatsapp();