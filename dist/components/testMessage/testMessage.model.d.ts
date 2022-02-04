export declare class TestMessageModel {
    fetchTestMessageByPhoneNumber(phoneNumber: string): Promise<any>;
    sendTestMessage(body: any, testMessageId: string | null): Promise<void>;
    private updateOrCreateTestMessage;
}
declare const _default: TestMessageModel;
export default _default;
