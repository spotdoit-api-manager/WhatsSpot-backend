import { getSerializedPhone } from './whatsapp-utils';
import { IImageMessage, IReason } from './whatsapp.interface';
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
} from "@adiwajshing/baileys-md";
import deviceModel from './../../../components/device/device.model';
import path from 'path';
import instanceProvider from './instance.provider';
export default class Whatsapp extends EventEmitter {
  client: any;
  phone: string;
  state: AuthenticationState;
  saveState: any;
  public authState: boolean = false;
  qrInProcess: boolean =false;
  public _instanceId: number;
  private retryCount =0;
  constructor(phone: string) {
    super();
    this._instanceId = instanceProvider.addInstance(this);
    this.state = useSingleFileAuthState(`${process.env.SESSIONS_FOLDER}/${phone}_cred.json`).state;
    this.saveState = useSingleFileAuthState(`${process.env.SESSIONS_FOLDER}/${phone}_cred.json`).saveState;
    this.phone = phone;
  }
  // start a connection
  public initiClient = async () => {
    try {
      const sock = makeWASocket({
        logger: P({ level: "info" }),
        printQRInTerminal: false,
        auth: this.state,
        version: [2,2204,13],
      });
      this.client = sock;
      this.startBasicEventListners();
      // await this.client.waitForSocketOpen();
      return { error: false }
    } catch (err) {
      return { error: true, message: err.message }
    }
  };

  public getQr = async () => {
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
          this.qrInProcess = false;
          this.client.ev.removeAllListeners();
          return;
        }
      } catch (err) {
        console.log(err);
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
        else if (connection === "close") this.handleConectionClose(lastDisconnect);
        else{
          const reason: IReason = this.getDisconnectReason(lastDisconnect);
          console.log("connection update (not open| not close)", update, reason);
        }
      } catch (err) {
        console.log(`Error in handling connection Update ${this.phone}`,err);
      }
    });

    // message upsert
    this.client.ev.on("messages.upsert", async (m: any) => {
      try {
        // console.log(JSON.stringify(m, undefined, 2))
        const msg = m.messages[0];

        if (!msg.key.fromMe) {
          console.log(`received msg :${msg.message?.conversation}`);
          console.log(`From: ${msg.key.remoteJid}`);
        } else {
          console.log(`sent msg :${JSON.stringify(msg.message)}`);
          console.log(`to: ${msg.key.remoteJid}`);
        }
        if (!msg.key.fromMe && m.type === "notify") {
          // console.log("replying to", m.messages[0].key.remoteJid);
          // await this.client!.sendReadReceipt(
          //   msg.key.remoteJid,
          //   msg.key.participant,
          //   [msg.key.id]
          // );
          // await this.sendMessageWTyping(this.phone, { text: 'Hello there!' }, msg.key.remoteJid)
        }
      } catch (err) {
        console.log(err);

      }
    });
  }

  private isMaxRetryReached(){
    if(this.retryCount>parseInt(process.env.MAX_WHATSAPP_RETRY)){
      this.client.ev.removeAllListeners();
      return true
    }
    return false;
  }

  private async reconnectClient() {
    console.log("RETRYING CONNECTION..", this.phone);
    this.retryCount++;
    if(this.isMaxRetryReached()){
      console.log(`[${this.phone}] Max Connection Retry Reached....`)
    }
    this.client.ev.removeAllListeners();
    await this.initiClient();
    this.startBasicEventListners();
  }

  private getDisconnectReason(lastDisconnect){
    let reason = null;
    if (lastDisconnect && (lastDisconnect.error as Boom)?.output.payload) {
      reason = (lastDisconnect.error as Boom)?.output.payload;
    }
    return reason;
  }

  private async handleConnectionOpen(){
    console.log(`Connection open`);
    
    await deviceModel.updateDevice(this.phone, {
      authState: true, reason: null
    });
    this.emit("authenticated", { phone: this.phone });
    return this.authState = true;
  }

  private async handleConectionClose(lastDisconnect){
    console.log(`Connection closed`);
    this.qrInProcess = false;

    const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
    if (shouldReconnect) {
      console.log(`Connection Close (Not Logged Out) Retrying..`);
      return await this.reconnectClient();
    }
    else {
      const reason = this.getDisconnectReason(lastDisconnect);
      await deviceModel.updateDevice(this.phone, {
        authState: false, reason
      });
      console.log("connection closed (logged out)", reason, this.phone);
      this.emit('LOGGEDOUT', { phone: this.phone, reason: reason?.message });
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
    msg: AnyMessageContent,
  ) => {
    try {
      const jid = getSerializedPhone(to);
      await this.client.presenceSubscribe(jid);
      await delay(500);
      const result = await this.client.sendMessage(jid, {
        text: msg, detectLinks: true,
      });
      if (result.status != 1) {
        return { error: true };
      }
      return { error: false };
    } catch (e) {
      console.log(e);
      return { error: true, message: e.message }
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
      console.log("serialized phone ", jid);
      console.log("message is ", msg);
      let msgBody = {
        image: msg.image,
        caption: msg.caption
      }
      const result = await this.client.sendMessage(jid, msgBody);
      if (result.status != 1) {
        return { error: true };
      }
      return { error: false };
    } catch (e) {
      console.log(e);

      return { error: true, message: e.message }
    }
  };

  public endClient() {
    // this.client.
    this.client.end();

  }

  public logoutClient() {
    this.client.logout();
  }

  // startSock()
}

instanceProvider.addClass(Whatsapp);

// export default new Whatsapp();
