import { EWhatsappMessageTypes } from "./../../lib/services/whatsapp/whatsapp.enum";
import {
  IWhatsappButtonMessage,
  IWhatsappTemplateMessage,
  IWhatsappButtonMessageButton,
  IWhatsappTextMessage,
  IWhatsappMessage,
  ITemplateButtons,
  IWhatsappListMessage,
} from "./../../lib/services/whatsapp/whatsapp.interface";
import { HTTP401Error } from "../../lib/utils/httpErrors";
import { testMessageConfig } from "../../config";
import whatsappClientService from "../../lib/services/whatsapp/whatsapp-client.service";
import { ITestMessage } from "./testMessage.interface";
import { ITestMessageModel, TestMessage } from "./testMessage.schema";
import Configs from "../configs/configs.schema";
import { IConfig } from "../configs/config.interface";

export class TestMessageModel {
  public async fetchTestMessageByPhoneNumber(phoneNumber: string) {
    return (await TestMessage.findOne({
      phoneNumber: phoneNumber,
    }).lean()) as ITestMessageModel;
  }

  public async sendTestMessage(body: any, testMessageId: string | null) {
    const config:IConfig = await Configs.findOne({}).select("testMessageType").lean();
    console.log("config is ", config.testMessageType);
    const message: IWhatsappMessage = this.getMessageBody(
      config.testMessageType || EWhatsappMessageTypes.TEXT_MESSAGE
    );
    const result = await whatsappClientService.sendTypeMessage(
      config.testMessageType,
      message,
      testMessageConfig.devicePhone,
      body.to
    );
    if (result.error) throw new HTTP401Error(result.message);
    await this.updateOrCreateTestMessage(body.to, testMessageId);
  }

  public async sendRawMessage(to: string, message: any) {
    const result = await whatsappClientService.sendRawMessage(
      testMessageConfig.devicePhone,
      to,
      message
    );
    if (result.error) throw new HTTP401Error(result.message);
  }

  private async updateOrCreateTestMessage(
    phoneNumber: string,
    testMessageId: string | null
  ) {
    if (testMessageId) {
      return await TestMessage.findByIdAndUpdate(testMessageId, {
        $inc: { messageCount: 1 },
      });
    }
    const newTestMessageBody: ITestMessage = { phoneNumber, messageCount: 0 };
    const newTestMessage: ITestMessageModel = new TestMessage(
      newTestMessageBody
    );
    const result = await newTestMessage.addTestMessage();
    return result;
  }

  private getMessageBody(messageType: EWhatsappMessageTypes): IWhatsappMessage {
    switch (messageType) {
      case EWhatsappMessageTypes.BUTTON_MESSAGE:
        return this.getButtonMessage();
        break;
      case EWhatsappMessageTypes.TEMPLATE_MESSAGE:
        return this.getTemplateMessage();
        break;
      case EWhatsappMessageTypes.LIST_MESSAGE:
        return this.getListMessage();
        break;
      case EWhatsappMessageTypes.TEXT_MESSAGE:
        return this.getTextMessage();
    }
  }

  private getTemplateMessage(): IWhatsappMessage {
    const buttons: ITemplateButtons[] = [
      {
        index: 1,
        urlButton: {
          displayText: "WhatsSpot Docs",
          url: "https://docs.whatsspot.in",
        },
      },
      {
        index: 2,
        callButton: {
          displayText: "Call WhatsSpot",
          phoneNumber: "+919099858434",
        },
      },
    ];
    const templateMessage: IWhatsappTemplateMessage = {
      text: "Welcome to WhatsSpot!!\nThis is a test message.",
      footer: "nice footer, link: https://whatsspot.in",
      templateButtons: buttons,
    };
    return templateMessage;
  }
  private getButtonMessage(): IWhatsappMessage {
    const buttons: IWhatsappButtonMessageButton[] = [
      {
        buttonId: "button1",
        buttonText: {
          displayText: "Button 1",
        },
        type: 1,
      },
      {
        buttonId: "button2",
        buttonText: {
          displayText: "Button 2",
        },
        type: 1,
      },
    ];
    const buttonMessage: IWhatsappButtonMessage = {
      text: "Welcome to WhatsSpot!!\nThis is a test message.",
      footer: "nice footer, link: https://whatsspot.in",
      buttons: buttons,
      headerType: 1,
    };
    return buttonMessage;
  }
  private getTextMessage(): IWhatsappMessage {
    const textMessage: IWhatsappTextMessage = {
      text: "Welcome to WhatsSpot!!\nThis is a test message.",
    };
    return textMessage;
  }
  private getListMessage(): IWhatsappMessage {
    const sections = [
      {
        title: "Section 1",
        rows: [
          {
            title: "Its awesome",
            rowId: "option1",
            description: "This is awesome feature",
          },
          {
            title: "Love It",
            rowId: "option2",
            description: "This is a description",
          },
        ],
      },
      {
        title: "Section 2",
        rows: [
          { title: "Useful", rowId: "option3" },
          { title: "Good", rowId: "option4" },
        ],
      },
    ];

    const listMessage: IWhatsappListMessage = {
      text: "This is a test message",
      footer: "nice footer, link: https://whatsspot.in",
      title: "Welcome to WhatsSpot!!",
      buttonText: "View Option",
      sections,
    };
    return listMessage;
  }
}

export default new TestMessageModel();
