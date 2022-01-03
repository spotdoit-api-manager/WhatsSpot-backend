import P from "pino";
import { Boom } from "@hapi/boom";
import makeWASocket, {
  DisconnectReason,
  AnyMessageContent,
  delay,
  useSingleFileAuthState,
  AuthenticationState,
} from "@adiwajshing/baileys-md";
import { eventEmitter } from "./whatsapp-client.service";
import clients from "../../data/clients.data";

interface WhatsappClient {
  phone: string;
  client: any;
  auth: any;
  saveState: any;
}

export class Whatsapp {
  constructor(){
  
  }
  // start a connection
  private startSock = (phone: string, state: any) => {
    return new Promise((resolve) => {
      try {
        const sock = makeWASocket({
          logger: P({ level: "info" }),
          printQRInTerminal: false,
          auth: state,
          // implement to handle retries
          getMessage: async (key: any) => {
            console.log("get message ", key);
            return {
              conversation: "hello",
            };
          },
        });
        resolve({ sock, error: false });
      } catch (e) {
        resolve({ error: true, message: e.message });
        console.log("error catch in startsock ", e);
      }
    });
  };

  public addClient = async (phone: string, getQr: boolean = false) => {
    const state: AuthenticationState = useSingleFileAuthState(
      `${phone}_cred.json`
    ).state;
    const saveState = useSingleFileAuthState(`${phone}_cred.json`).saveState;

    const sockData: any = await this.startSock(phone, state);
    if (sockData.error)
      console.log("error in creating sock ", sockData.message);

    const clientData: WhatsappClient = {
      client: sockData.sock,
      auth: false,
      phone: phone,
      saveState: saveState,
    };
    clients[phone] = clientData;
    this.startBasicEventListners(phone, saveState);

    if (getQr) await this.getQr(phone);
    return clientData;
  };

  public getQr = async (phone: string) => {
    let clientData: WhatsappClient = clients[phone];
    if (!clientData) {
        clientData = await this.addClient(phone, false);
      console.log("client not available (get qr)");
    }
    
    if (clientData.auth) {
      console.log("client is already authenticated");
    } else {
       
      clientData.client.ev.on("connection.update", async (update: any) => {
        const { connection, lastDisconnect } = update;
        if (update.qr) {
          eventEmitter.emit("qr_update", {
            phone: clientData.phone,
            qr: update.qr,
          });
          return;
        }else if (lastDisconnect &&
          (lastDisconnect.error as Boom)?.output?.payload.message ==
          "QR refs attempts ended"
        ) {
          eventEmitter.emit("qr_exceeded", { phone: clientData.phone });
          this.closeClient(clientData.phone);
          this.removeClient(clientData.phone);
          return;
        }
      });
    }
  };

  closeClient = (phone: string) => {
    console.log("client connection closing ", phone);
    console.log("clients are ", clients);

    const clientData = clients[phone];
    if (!clientData) return console.log("client not available ", phone);
    clientData.client.end();
  };

  removeClient = (phone: string) => {
    const clientData = clients[phone];
    console.log("removing client ", clientData.phone);
    if (clientData) {
      return delete clients[phone];
    }
    return console.log("client removed ", clientData.phone);
  };

  private startBasicEventListners(phone: string, saveState: any) {
    const clientData = clients[phone];
    if (!clientData)
      return console.log("client not availabel (startBasicListner)");
    // console.log(`cred update for ${phone}`);
    //cred update listner
    clientData.client.ev.on("creds.update", clientData.saveState);

    //connection update
    clientData.client.ev.on("connection.update", async (update: any) => {
        const { connection, lastDisconnect } = update;
        console.log(update);
        
      if (connection === "close") {
        if (
          (lastDisconnect.error as Boom)?.output?.statusCode !==
          DisconnectReason.loggedOut
        ) {
          console.log("connection closed (not logged out)");
          console.log((lastDisconnect.error as Boom)?.output);
          await this.reconnectClient(phone);
        }
      } else {
        console.log("connection update ", update);
        // console.log((lastDisconnect?.error as Boom)?.output);
      }
    });

    // message upsert 
    clientData.client.ev.on('messages.upsert', async (m:any) => {
        console.log("message upser");
        
        console.log(JSON.stringify(m, undefined, 2))
        
        const msg = m.messages[0]
        if(!msg.key.fromMe && m.type === 'notify') {
            console.log('replying to', m.messages[0].key.remoteJid)
            await clientData.client!.sendReadReceipt(msg.key.remoteJid, msg.key.participant, [msg.key.id])
            await this.sendMessageWTyping(clientData.phone,{ text: 'Hello there!' }, msg.key.remoteJid)
        }
        
    })


  }

  private async reconnectClient(phone: string) {

      await this.addClient(phone);
  }

  private sendMessageWTyping = async(phone:string,msg: AnyMessageContent, jid: string) => {
      const clientData = clients[phone];

    await clientData.client.ev.presenceSubscribe(jid)
    await delay(500)

    await clientData.client.sendPresenceUpdate('composing', jid)
    await delay(2000)

    await clientData.client.sendPresenceUpdate('paused', jid)

    await clientData.client.sendMessage(jid, msg)
}
  // startSock()
}

export default new Whatsapp();
