import { IWhatsappButtonMessage, IWhatsappTemplateMessage, IWhatsappTextMessage,IWhatsappListMessage } from "./../../lib/services/whatsapp/whatsapp.interface";
import { HTTP401Error } from "../../lib/utils/httpErrors";
import { testMessageConfig } from "../../config";
import whatsappClientService from "../../lib/services/whatsapp/whatsapp-client.service";
import { ITestMessage } from "./testMessage.interface";
import { ITestMessageModel, TestMessage } from "./testMessage.schema";

export class TestMessageModel{
    public async fetchTestMessageByPhoneNumber(phoneNumber: string){
        return await  TestMessage.findOne({phoneNumber:phoneNumber}).lean() as ITestMessageModel;
    }

    public async sendTestMessage(body: any,testMessageId: string|null){
        const sections = [
            {
            title: "Section 1",
            rows: [
                {title: "Its awesome", rowId: "option1",description: "This is awesome feature"},
                {title: "Love It", rowId: "option2", description: "This is a description"}
            ]
            },
           {
            title: "Section 2",
            rows: [
                {title: "Useful", rowId: "option3"},
                {title: "Good", rowId: "option4", }
            ]
            },
        ];
        
        const listMessage:IWhatsappListMessage = {
          text: "This is a test message",
          footer: "nice footer, link: https://whatsspot.in",
          title: "Welcome to WhatsSpot!!",
          buttonText: "View Option",
          sections
        };
            const result  = await whatsappClientService.sendListMessage(testMessageConfig.devicePhone,body.to,listMessage);
            // const textMsg: IWhatsappTextMessage = {
            //     text:"Welcome to WhatsSpot!!\nThis is a test message."
            // };
            // const result  = await whatsappClientService.sendTextMessage(testMessageConfig.devicePhone,body.to,textMsg);
            if(result.error) throw new HTTP401Error(result.message);
            await this.updateOrCreateTestMessage(body.to,testMessageId);
    }

    public async sendRawMessage(to: string,message: any){
        const result  = await whatsappClientService.sendRawMessage(testMessageConfig.devicePhone,to,message);
        if(result.error) throw new HTTP401Error(result.message);
    }

    private async updateOrCreateTestMessage(phoneNumber: string,testMessageId: string|null){
        if(testMessageId){
            return await TestMessage.findByIdAndUpdate(testMessageId,{$inc:{messageCount:1}});
        }
        const newTestMessageBody: ITestMessage = {phoneNumber,messageCount:0};
        const newTestMessage: ITestMessageModel = new TestMessage(newTestMessageBody);
        const result = await newTestMessage.addTestMessage();
        return result;

    }

}

export default new TestMessageModel();