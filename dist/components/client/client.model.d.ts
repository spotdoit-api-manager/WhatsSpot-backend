export declare class ClinetModel {
    addOrUpdateClient(phone: string, clientData: any): Promise<void | {
        error: boolean;
        message: string;
    } | {
        error: boolean;
        message?: undefined;
    }>;
}
declare const _default: ClinetModel;
export default _default;
