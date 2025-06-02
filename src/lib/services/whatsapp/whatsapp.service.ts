/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as fs from 'fs';
import { getSerializedPhone } from "./whatsapp-utils";
import {  IReason, IWhatsappMessage, IWhatsappTextMessage } from "./whatsapp.interface";
import { EventEmitter } from "events";
import P from "pino";
import { Boom } from "@hapi/boom";
import makeWASocket, {
  DisconnectReason,
  delay,
  useMultiFileAuthState,
  AuthenticationState,
  makeCacheableSignalKeyStore,
  BaileysEventMap,
  fetchLatestBaileysVersion,
} from "@whiskeysockets/baileys";

import instanceProvider from "./instance.provider";
import logger from "../../../core/logger";
import notifyService from "../notify.service";
import fileManagement from "../../../lib/helpers/file.management";
import deviceUtils from "../../../components/device/device.utils";
 


const logFileName = "[WhatsappService] : ";
const refreshInterval = 300;// 1800; //in seconds
// 5 minutes in seconds is 300
export default class Whatsapp extends EventEmitter {
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
  private isMaxRetryDone = false;
  private removed =false;
  private firstConnect = false;
  private lastStatus = false;

  private logger = P({ level: "info" });
  
private interval;
  constructor(deviceId: string,phone: string) {
    super();
    this._instanceId = instanceProvider.addInstance(this);
   
    this.phone = phone;
    this.deviceId = deviceId;
    this.initRefreshInterval();
  }
  private initRefreshInterval(){
    this.interval = setInterval(()=>{
      logger.info(logFileName,`[${this.phone}] Refreshing Client`);
      this.getDeviceStatus();
    },refreshInterval*1000);
  }

  private closeRefreshInterval(){
    if(this.interval){
      logger.info(logFileName,`[${this.phone}] Closing Refresh Interval`);
      clearInterval(this.interval);
    }
  }
  // start a connection
  public initiClient = async (notify:boolean=true) => {
    this.firstConnect = !notify;
    // if(!this.qrRequested) return;
    try {
      // Define the folder path
      const folderPath = `${process.env.SESSIONS_FOLDER}/${this.phone}_cred`;
      // Ensure the folder exists
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
      const cred = await useMultiFileAuthState(`${process.env.SESSIONS_FOLDER}/${this.phone}_cred`);
      this.state =  cred.state;
      this.saveState = cred.saveCreds;
      const { version, isLatest } = await fetchLatestBaileysVersion();
      console.log(`using WA v${version.join(".")}, isLatest: ${isLatest}`);

      const config: any ={
        
         version,//:[2,2323,4],
        logger: this.logger, //`silent`
        printQRInTerminal: true,
        auth: {
          creds: this.state.creds,
          /** caching makes the store faster to send/recv messages */
          keys: makeCacheableSignalKeyStore(this.state.keys,this.logger),
        },
        browser:["Mac OS", "Chrome", "10.15.3"],

        downloadHistory: false,
        shouldSyncHistoryMessage:false,
        syncFullHistory:false,
      //   patchMessageBeforeSending: (message) => {
      //     const requiresPatch = !!(
      //         message.buttonsMessage ||
      //         // || message.templateMessage
      //         message.listMessage
      //     );
      //     if (requiresPatch) {
      //         message = {
      //             viewOnceMessage: {
      //                 message: {
      //                     messageContextInfo: {
      //                         deviceListMetadataVersion: 2,
      //                         deviceListMetadata: {},
      //                     },
      //                     ...message,
      //                 },
      //             },
      //         };
      //     }

      //     return message;
      // },

      } ;
      const sock = makeWASocket(config);
      this.client = sock;
      sock.ev.process(async(ev)=>await this.handleSockEvents(ev));

      await this.client.waitForSocketOpen();
      return { error: false };
    } catch (err) {
      return { error: true, message: err.message };
    }
  };

  public getQr = async () => {
    this.qrRequested = true;
    if(this.qrInProcess) return;
    this.qrInProcess = true;
    this.client.ev.on("connection.update", async (update: any) => {
      try {
        const { connection, lastDisconnect, qr } = update;
        if (connection === "connecting") return;
        if (qr) {
          this.emit("qr", { qr: update.qr, error: false });
          return;
        }
        if (this.checkIfQrRetryExceeded(lastDisconnect)) {
          this.emit("qr", { error: true, message: "QR_RETRY_EXCEEDED" });
          this.qrRequested = true;
          this.qrInProcess = false;
          this.client.ev.removeAllListeners();
          return;
        }
      } catch (err) {
        logger.error(logFileName,err);
      }
    });
  };

  
  private checkIfQrRetryExceeded(lastDisconnect) {
    if (lastDisconnect && (lastDisconnect.error as Boom)?.output?.payload.message ==
      "QR refs attempts ended") {
      return true;
    }
    false;
  }

  private async handleSockEvents(events:Partial<BaileysEventMap>){
    if(events["creds.update"]) {
      await this.saveState();
    }else if(events["connection.update"]){
      await this.handleConnectionEvent(events["connection.update"]);
    }else if(events["messages.upsert"]){
      await this.handleMessageEvent(events["messages.upsert"]);
    }
  }

  private handleConnectionEvent = async (update: any) => {
    try {
      console.log("connection update: ", update);
      const { connection, lastDisconnect } = update;
      if(connection=="connecting") return;
      if (connection === "open") await this.handleConnectionOpen();
      else if (connection === "close") this.handleConnectionClose(lastDisconnect);
      else{
        const reason: IReason = this.getDisconnectReason(lastDisconnect);
        logger.debug(logFileName,"connection update (not open| not close)", update, reason);
        if(update.qr){
          this.updateDeviceStatus(false,reason);
        }
        // else{
        //   this.reconnectClient();
        // }

        this.qrInProcess = true;
      }
    } catch (err) {
      logger.error(logFileName,`Error in handling connection Update ${this.phone}`,err);
    }
  }


  private async handleMessageEvent(m: any) {
    try {
      const msg = m.messages[0];
      // console.log("msg",JSON.stringify(msg,null,2));
      if (!msg.key.fromMe) {
        if(!msg.message?.conversation && !msg.message?.extendedTextMessage){
          logger.info(logFileName,`received other msg :${msg[Object.keys(msg)[0]]}`);
          logger.info(logFileName,`From: ${msg.key.remoteJid}`);
          return;
        }
        const msgText = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
        logger.info(logFileName,`received msg :${msgText}`);
        logger.info(logFileName,`From: ${msg.key.remoteJid}`);
        if(msgText){//if it is text type message
          this.emit("NEW_MESSAGE", msg);
        }
      } else {
        logger.info(logFileName,`sent msg :${JSON.stringify(msg.message)}`);
        logger.info(logFileName,`to: ${msg.key.remoteJid}`);
      }
     
    } catch (err) {
      logger.error(logFileName,`Error in message upsert for client ${this.phone}`);
      console.log(err);
    }
  }

  private startBasicEventListners() {
    // this.client.ev.removeAllListeners();
    //cred update listner
   


  }



  private isMaxRetryReached(){
    if(this.retryCount>parseInt(process.env.MAX_WHATSAPP_RETRY)){
      this.client.ev.removeAllListeners();
      return true;
    }
    return false;
  }

  private async reconnectClient() {
    logger.warn("RETRYING CONNECTION..", this.phone);
    this.retryCount++;
    if(this.isMaxRetryReached()){
      this.retryCount = 0;
      logger.warn(logFileName,`[${this.phone}] Max Connection Retry Reached....`);
      this.destroyClient();
      if(this.isMaxRetryDone) return;
      notifyService.deviceMaxRetryReached(this.deviceId);
      this.isMaxRetryDone =   true;
      return;
    }

    this.client.ev.removeAllListeners();
    await this.initiClient();
  }

  private getDisconnectReason(lastDisconnect){
    let reason = null;
    if (lastDisconnect && (lastDisconnect.error as Boom)?.output.payload) {
      reason = (lastDisconnect.error as Boom)?.output.payload;
    }
    return reason;
  }

  private async destroyClient(){
    try{
      await this.removeAllListeners();
      await this.client?.ev?.removeAllListeners();
      await this.client?.end();
      this.closeRefreshInterval();

    }catch(e){

    }
  }

  public async getDeviceStatus(){
    try{ 
       await this.client.sendPresenceUpdate("available", getSerializedPhone("919099858434"));
       return {status:true};
    }catch(e){
      console.log(e.message);
      if(e.message == "Connection Closed"){
        return this.reconnectClient();
      }
      await deviceUtils.updateDevice(this.deviceId, {
        authState: false, reason:e.message
      });
      return {status:false};
    }

  }
  private async handleConnectionOpen(){
     logger.info(logFileName,"CONNECTION_OPENED");
    this.qrRequested = true;
    this.qrInProcess = false;
    this.retryCount = 0;
    this.emit("authenticated", { phone: this.phone });
     deviceUtils.updateDevice(this.deviceId, {
      authState: true, reason: null
    });
      if(!this.firstConnect && !this.authState && !this.lastStatus){
        this.firstConnect = false;
        notifyService.deviceAuthorized(this.deviceId);
      }
     this.authState = true;
     this.lastStatus = true;

  }

  private async deleteAuthFile(){
    try{
      const authFilePath = `${process.env.SESSIONS_FOLDER}/${this.phone}_cred.json`;
      const newAuthFile = `${process.env.SESSIONS_FOLDER}/${this.phone}_cred`;
      await fileManagement.deleteFile(authFilePath);
      await fileManagement.deleteFolder(newAuthFile);
    }catch(e){
      logger.error(`Error in deleting auth file for ${this.phone}: `,e);
    }
  }

  private async handleConnectionClose(lastDisconnect){
    const shouldReconnect = (lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
    if (shouldReconnect) {
      logger.warn(logFileName,"CONNECTION_CLOSED (NOT_LOGGED_OUT) Retrying......");
      this.authState = false;

      return await this.reconnectClient();
    }
    else {
      const reason = this.getDisconnectReason(lastDisconnect);
      this.deleteAuthFile();
      await deviceUtils.updateDevice(this.deviceId, {
        authState: false, reason
      });
      this.authState = false;
      notifyService.deviceConnectionClosed(this.deviceId,reason);

      this.qrInProcess = false;
      this.qrRequested = false;
      logger.warn(logFileName,"CONNECTION_CLOSED (LOGGEDOUT)", reason, this.phone);
      this.emit("LOGGED_OUT", { phone: this.phone, reason: reason?.message });
      this.lastStatus = false;
      this.closeRefreshInterval();
    }
  }

  private async updateDeviceStatus(authState: boolean,reason: IReason){
    if(!this.removed){

      return await deviceUtils.updateDevice(this.deviceId, {
        authState, reason
      });
    }else{
     logger.warn(logFileName,"tried to update Device Status but device is removed",authState,reason);
    }
  }
  
  public sendAnyMessage = async (
    to: string,
    msg: IWhatsappMessage
  ) => {
    try {
      const jid = getSerializedPhone(to);
      await this.client.presenceSubscribe(jid);
      await delay(500);
      const result = await this.client.sendMessage(jid, {
        ...msg, detectLinks: true,
      });
      logger.debug(logFileName,`Sent  Result client ${this.phone} :`,result);

      if (result.status != 1) {
        return { error: true };
      }
      return { error: false };
    } catch (e) {
      logger.error(logFileName,`Sent Error client ${this.phone} :`,e);

      return { error: true, message: e.message };
    }
  };


  public endClient() {
    // this.client.
    this.removed=true;
    this.client.end();
  

  }

  public async logoutClient() {
    try{
      await this.client.logout();
      return {error:false};
    }catch(e){
      return {error:true,message:e.message};
    }

  }

  // startSock()
}

instanceProvider.addClass(Whatsapp);

// export default new Whatsapp();
