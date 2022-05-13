/* eslint-disable @typescript-eslint/camelcase */
import { deSanatizeMobile } from "./../utils/index";
import { WhatsappConfig } from "./../interfaces/providers.interface";
import { pilvoConfig, fast2SmsConfig } from "./../../config/index";
import axios from "axios";
import messageModel from "../../components/messages/message.model";
import { EWhatsappMessageTypes } from "./whatsapp/whatsapp.enum";
import logger from "../../lib/utils/logger";
// const plivo = require("plivo");
const logFileName = "[OTPService] : ";
export class OTPMessagesService {
  // private _plivoClient: any;
  // constructor() {
  //   this._plivoClient = new plivo.Client(pilvoConfig.authId,pilvoConfig.authToken);
  // }

  // async sendPilvoSMS(fullNumber: string, message: string) {
  //   const result = await this._plivoClient.messages.create(pilvoConfig.sourceNumber, fullNumber, message);
  //   console.log("pilvo result ",result);
  //   return {proceed: true};
  // }

  async sendFast2Sms(number: string, message: string) {
    console.log("sending message to ",number,message);
    
    const body = {
      route: "v3",
      sender_id: fast2SmsConfig.senderId,
      message: message,
      language: "english",
      flash: 0,
      numbers: number,
    };
    try {
      const result = await axios.post(fast2SmsConfig.url, body, {
        headers: { authorization: fast2SmsConfig.authToken, "content-type": "application/json" },
      });
      
      if(result.data && result.data.return){
        return {proceed: true};
      }
      return {proceed:false,message:result.data.message};
    } catch (err) {
      console.error("sendFast2Sms send error" + err);
      return {proceed: false};

    }
  }

public sendTextLocalMessage = async (to: string, message: string) => {
    return axios.get("https://api.textlocal.in/send/", {
    params: {
      apiKey:"jkhljkhkljhkljhkljh7i87gho87y8y8",
      // sender: 'SENDER',
      numbers: "91" + to,
      message: message
    }
  }).then((response) => {
    const responseJson = response.data;
    console.log(responseJson);
    if (responseJson.status === "success") {
      console.log(`Send OTP Success to ${to}`);
      return {proceed: true};
    } else {
      console.log("Error Sending OTP");
      console.log(responseJson);
      return {proceed: false};
    }
  }).catch(e => {
    console.log("Error Sending OTP");
    console.log(e);
    return {proceed: false};
  });
};


public  sendWhatsappMessage(to: string,message: string){
  try{
    messageModel.sendTypeMessage(EWhatsappMessageTypes.TEXT_MESSAGE,{text:message},process.env.TEST_MESSAGE_DEVICE_NUMBER,to);
  }catch(e){
    logger.info(logFileName,`Error sending whatsapp OTP to ${to}`);
  }
}

}

export default new OTPMessagesService();
