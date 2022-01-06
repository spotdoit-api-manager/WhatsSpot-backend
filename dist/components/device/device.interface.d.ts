import { IReason } from './../../lib/services/whatsapp/whatsapp.interface';
export interface IDevice {
    name: string;
    phone: string;
    authState: boolean;
    reason: IReason;
}
export interface TextMessage {
    message: String;
    numbers: string;
}
