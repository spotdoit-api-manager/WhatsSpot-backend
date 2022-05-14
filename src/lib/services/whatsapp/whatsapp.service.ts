import { getSerializedPhone } from "./whatsapp-utils";
import { IButtonMessage, IImageMessage, IReason, IWhatsappListMessage, IWhatsappTextMessage } from "./whatsapp.interface";
import { EventEmitter } from "events";
import P from "pino";
import { Boom } from "@hapi/boom";
import makeWASocket, {
  DisconnectReason,
  AnyMessageContent,
  delay,
  useSingleFileAuthState,
  AuthenticationState,
  SocketConfig,
  CommonSocketConfig,
} from "@adiwajshing/baileys";

import deviceModel from "./../../../components/device/device.model";
import path from "path";
import instanceProvider from "./instance.provider";
import logger from "../../../core/logger";
import notifyService from "../notifiy.srvice";
const logFileName = "[WhatsappService] : ";
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
  constructor(deviceId: string,phone: string) {
    super();
    this._instanceId = instanceProvider.addInstance(this);
    this.state = useSingleFileAuthState(`${process.env.SESSIONS_FOLDER}/${phone}_cred.json`).state;
    this.saveState = useSingleFileAuthState(`${process.env.SESSIONS_FOLDER}/${phone}_cred.json`).saveState;
    this.phone = phone;
    this.deviceId = deviceId;
  }
  // start a connection
  public initiClient = async () => {
    // if(!this.qrRequested) return;
    try {
      const sock = makeWASocket({
        logger: P({ level: "info" }), //silent
        printQRInTerminal: false,
        auth: this.state,
        // version: [2,2204,13],
      });
      this.client = sock;
      this.startBasicEventListners();
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
        };
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
    };
    false;
  }

  private startBasicEventListners() {
    // this.client.ev.removeAllListeners();
    //cred update listner
    this.client.ev.on("creds.update", this.saveState);

    //connection update
    this.client.ev.on("connection.update", async (update: any) => {
      try {
        const { connection, lastDisconnect } = update;
        if(connection=="connecting") return;
        if (connection === "open") await this.handleConnectionOpen();
        else if (connection === "close") this.handleConnectionClose(lastDisconnect);
        else{
          const reason: IReason = this.getDisconnectReason(lastDisconnect);
          logger.debug(logFileName,"connection update (not open| not close)", update, reason);
          this.qrInProcess = true;
        }
      } catch (err) {
        logger.error(logFileName,`Error in handling connection Update ${this.phone}`,err);
      }
    });

    // message upsert
    this.client.ev.on("messages.upsert", async (m: any) => {
      try {
        // logger.log(JSON.stringify(m, undefined, 2))
        const msg = m.messages[0];

        if (!msg.key.fromMe) {
          logger.debug(logFileName,`received msg :${msg.message?.conversation}`);
          logger.debug(logFileName,`From: ${msg.key.remoteJid}`);
        } else {
          logger.log(logFileName,`sent msg :${JSON.stringify(msg.message)}`);
          logger.log(logFileName,`to: ${msg.key.remoteJid}`);
        }
        if (!msg.key.fromMe && m.type === "notify") {
          // logger.log("replying to", m.messages[0].key.remoteJid);
          // await this.client!.sendReadReceipt(
          //   msg.key.remoteJid,
          //   msg.key.participant,
          //   [msg.key.id]
          // );
          // await this.sendMessageWTyping(this.phone, { text: 'Hello there!' }, msg.key.remoteJid)
        }
      } catch (err) {
        logger.error(logFileName,err);
      }
    });
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
      notifyService.deviceMaxRetryReached(this.deviceId);
      // this.destroyClient();
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

  private destroyClient(){
    return;
  }

  public async getDeviceStatus(){
    try{ 
       await this.client.sendPresenceUpdate("available", getSerializedPhone("919099858434"));
       return {status:true};
    }catch(e){
      console.log(e.message);
      await deviceModel.updateDevice(this.deviceId, {
        authState: false, reason:"unknown"
      });
      return {status:false};
    }

  }
  private async handleConnectionOpen(){
     logger.info(logFileName,"CONNECTION_OPENED");
    this.qrRequested = true;
    this.qrInProcess = false;
    this.emit("authenticated", { phone: this.phone });
     deviceModel.updateDevice(this.deviceId, {
      authState: true, reason: null
    });

    notifyService.deviceAuthorized(this.deviceId);
     this.authState = true;
  }

  private async handleConnectionClose(lastDisconnect){
    const shouldReconnect = (lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
    if (shouldReconnect) {
      logger.warn(logFileName,"CONNECTION_CLOSED (NOT_LOGGED_OUT) Retrying......");
      return await this.reconnectClient();
    }
    else {
      const reason = this.getDisconnectReason(lastDisconnect);
      await deviceModel.updateDevice(this.deviceId, {
        authState: false, reason
      });
      notifyService.deviceConnectionClosed(this.deviceId,reason);

      this.qrInProcess = false;
      this.qrRequested = false;
      logger.warn(logFileName,"CONNECTION_CLOSED (LOGGEDOUT)", reason, this.phone);
      this.emit("LOGGEDOUT", { phone: this.phone, reason: reason?.message });
    }
  }
  private sendMessageWTyping = async (
    phone: string,
    msg: AnyMessageContent,
    jid: string
  ) => {
    await this.client.presenceSubscribe(jid);
    await delay(500);

    await this.client.sendPresenceUpdate("composing", jid);
    await delay(2000);

    await this.client.sendPresenceUpdate("paused", jid);

    await this.client.sendMessage(jid, msg);
  };

  public sendTextMessage = async (
    to: string,
    msg: IWhatsappTextMessage,
  ) => {
    try {
      const jid = getSerializedPhone(to);
      logger.info(logFileName,`Sending Text Message to ${jid} ${JSON.stringify(msg)}`);
      await this.client.presenceSubscribe(jid);
      await delay(500);
      const result = await this.client.sendMessage(jid, {
        ...msg, detectLinks: true,
      });
      logger.debug(result);

      if (result.status != 1) {
        return { error: true };
      }
      return { error: false };
    } catch (e) {
      logger.log(e);
      return { error: true, message: e.message };
    }
  };

  public sendListMessage = async (
    to: string,
    msg: IWhatsappListMessage,
  ) => {
    try {
      const jid = getSerializedPhone(to);
      logger.info(logFileName,`Sending List Message to ${jid} ${JSON.stringify(msg)}`);

      await this.client.presenceSubscribe(jid);
      await delay(500);
      const result = await this.client.sendMessage(jid, {
        ...msg, detectLinks: true,
      });
      logger.debug(result);

      if (result.status != 1) {
        return { error: true };
      }
      return { error: false };
    } catch (e) {
      logger.log(e);
      return { error: true, message: e.message };
    }
  };
  public sendMediaMessage = async (
    to: string,
    msg: IImageMessage,
  ) => {
    try {
      const jid = getSerializedPhone(to);
      await this.client.presenceSubscribe(jid);
      await delay(500);
      logger.log("serialized phone ", jid);
      logger.log("message is ",msg as any);
      const msgBody = {
        image: msg.image,
        caption: msg.caption
      };
      const result = await this.client.sendMessage(jid, msgBody);
      if (result.status != 1) {
        return { error: true };
      }
      return { error: false };
    } catch (e) {
      logger.log(e);

      return { error: true, message: e.message };
    }
  };

  public sendRawMessage = async(to: string,msg: any)=>{
    try{
      const jid = getSerializedPhone(to);
      logger.debug(logFileName,`Sending Raw Message to ${jid}`);
      await this.client.presenceSubscribe(jid);
      await delay(500);
      const result = await this.client.sendMessage(jid, msg);
      if (result.status != 1) {
        return { error: true };
      }
      return { error: false };
    }catch(e){

    }
  }

  public sendButtonMessage = async(to: string,btnMsg: IButtonMessage)=>{
    try{
      const jid = getSerializedPhone(to);
      logger.debug(logFileName,`Sending ButtonMessage to ${jid}`);
      await this.client.presenceSubscribe(jid);
      await delay(500);
      const result = await this.client.sendMessage(jid, btnMsg);
      logger.debug(result);
      if (result.status != 1) {
        return { error: true };
      }
      return { error: false };
    }catch(e){
      logger.error(logFileName,e);
    }
  }

  public sendTemplateMessage = async(to: string,templateMsg: IButtonMessage)=>{
    try{
      const jid = getSerializedPhone(to);
      logger.debug(logFileName,`Sending Template Message to ${jid}`);
      await this.client.presenceSubscribe(jid);
      await delay(500);
      const result = await this.client.sendMessage(jid, templateMsg);
      logger.debug(result);
      if (result.status != 1) {
        return { error: true };
      }
      return { error: false };
    }catch(e){
      logger.error(logFileName,e);
    }
  }

  public endClient() {
    // this.client.
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
