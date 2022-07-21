import { IWhatsappButtonMessage, IWhatsappTemplateMessage } from "./../../lib/services/whatsapp/whatsapp.interface";
import { HTTP401Error } from "../../lib/utils/httpErrors";
import { testMessageConfig } from "../../config";
import whatsappClientService from "../../lib/services/whatsapp/whatsapp-client.service";
import { ITestMessage } from "./testMessage.interface";
import { ITestMessageModel, TestMessage } from "./testMessage.schema";

export class TestMessageModel{
    public async fetchTestMessageByPhoneNumber(phoneNumber: string){
        return await  TestMessage.findOne({phoneNumber:phoneNumber}).lean();
    }

    public async sendTestMessage(body: any,testMessageId: string|null){
        const tempMsg: IWhatsappTemplateMessage = {
            text: "Welcome to WhatsSpot!!",
            footer: "This is test message",
            templateButtons: [
                {index: 1, urlButton: {displayText: "Show Api Documentation", url: "https://www.whatsspot.in/docs/index.html"}},
                {index: 3, urlButton: {displayText: "View Plans",url:"https://www.whatsspot.in/#plans"}},
            ]
        };
            const result  = await whatsappClientService.sendTemplateMessage(testMessageConfig.devicePhone,body.to,tempMsg);
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