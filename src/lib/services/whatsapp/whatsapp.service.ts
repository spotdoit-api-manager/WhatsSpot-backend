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
  client:any ;
  phone: string;
  state: AuthenticationState;
  saveState: any;
  public authState: boolean = false;
  qr: any = new EventEmitter();
  public _instanceId:number;
  
  constructor(phone: string) {
    super();
    this._instanceId = instanceProvider.addInstance(this);

    this.state = useSingleFileAuthState(`${process.env.SESSIONS_FOLDER}/${phone}_cred.json`).state;
    this.saveState = useSingleFileAuthState(`${process.env.SESSIONS_FOLDER}/${phone}_cred.json`).saveState;
    this.phone = phone;
    // this.client = this.startSock();
  }
  // start a connection
  public  initiClient = async() => {
    try{
      const sock= makeWASocket({
        logger: P({ level: "info" }),
        printQRInTerminal: false,
        auth: this.state,
      });
      this.client = sock;
      this.startBasicEventListners();
      await this.client.waitForSocketOpen();
      return {error:false}
    }catch(err){
      return {error:true,message:err.message}
    }
    };

  public getQr = async () => {
    this.client.ev.on("connection.update", async (update: any) => {
      try {


        const { connection, lastDisconnect } = update;

        if (connection === "connecting") return;
        // if (connection == "close") this.emit('qr', { error: true, message: "CONNECTION_CLOSED" });
        if (update.qr) {
          this.emit("qr", { qr: update.qr, error: false });
          return;
        } else if (
          lastDisconnect &&
          (lastDisconnect.error as Boom)?.output?.payload.message ==
          "QR refs attempts ended"
        ) {
          this.emit("qr", { error: true, message: "QR_RETRY_EXCEEDED" });
          this.client.ev.removeAllListeners();
          return;
        }
      } catch (err) {
        console.log(err);

      }
    });
  };

  private startBasicEventListners() {
    // this.client.ev.removeAllListeners();
    //cred update listner
    this.client.ev.on("creds.update", this.saveState);

    //connection update
    this.client.ev.on("connection.update", async (update: any) => {
      try {
        const { connection, lastDisconnect } = update;
        let reason: IReason;
        if (lastDisconnect && (lastDisconnect.error as Boom)?.output.payload) {
          reason = (lastDisconnect.error as Boom)?.output.payload;
        }
        console.log(update);

        console.log("connection update (listner)", reason);


        if (connection === "open") {
          const data = deviceModel.updateDevice(this.phone, {
            authState: true, reason: null
          });
          this.emit("authenticated", { phone: this.phone });
          return this.authState = true;
        } else if (connection === "close") {

          if (
            (lastDisconnect.error as Boom)?.output?.statusCode !==
            DisconnectReason.loggedOut
          ) {
            console.log("connection closed (not logged out)");
            const data = deviceModel.updateDevice(this.phone, {
              authState: false, reason
            });
            await this.reconnectClient();
          }else if(reason?.statusCode===428){
            const data = await deviceModel.updateDevice(this.phone, {
              authState: false, reason
            });
            console.log("connection teminated", reason, this.phone);
          } 
          else {
            const data = await deviceModel.updateDevice(this.phone, {
              authState: false, reason
            });
            console.log("connection update (logged out)", reason, this.phone);
            this.emit('LOGGEDOUT', { phone: this.phone, reason: reason.message });
          }
        } else if (!update.qr) {
          // const data = deviceModel.updateDevice(this.phone, {
          //   authState: false,reason
          // });

          console.log("connection update (not open| not close)", update, reason);
        }
      } catch (err) {

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
          await this.client!.sendReadReceipt(
            msg.key.remoteJid,
            msg.key.participant,
            [msg.key.id]
          );
          // await this.sendMessageWTyping(this.phone, { text: 'Hello there!' }, msg.key.remoteJid)
        }
      } catch (err) {
        console.log(err);

      }
    });
  }

  private async reconnectClient() {
    console.log("RETRYING CONNECTION..", this.phone);
    await this.initiClient();
    this.startBasicEventListners();
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
