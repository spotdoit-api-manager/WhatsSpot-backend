declare class PaymentHelpers {
    private crypt;
    paramsToString(params: any, mandatoryflag?: any): string;
    genchecksum(params: any, key: any, cb: any): void;
    genchecksumbystring(params: any, key: any, cb: any): void;
    verifychecksum(params: any, key: string, checksumhash: string): boolean;
    verifychecksumbystring(params: any, key: any, checksumhash: string): boolean;
    genchecksumforrefund(params: any, key: string, cb: any): void;
    paramsToStringrefund(params: any, mandatoryflag?: any): string;
    paymentHTMLRender(final_url: string, formData: any): string;
    responseHTMLRender(tableData: any): string;
}
declare const _default: PaymentHelpers;
export default _default;
