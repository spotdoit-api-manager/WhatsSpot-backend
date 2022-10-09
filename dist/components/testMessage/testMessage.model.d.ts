import { ITestMessageModel } from "./testMessage.schema";
export declare class TestMessageModel {
    fetchTestMessageByPhoneNumber(phoneNumber: string): Promise<ITestMessageModel>;
    sendTestMessage(body: any, testMessageId: string | null): Promise<void>;
    sendRawMessage(to: string, message: any): Promise<void>;
    private updateOrCreateTestMessage;
}
declare const _default: TestMessageModel;
export default _default;
