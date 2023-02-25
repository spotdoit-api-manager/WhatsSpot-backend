import { IScheduleMessageModel } from "./../../components/messages/message.schema";
export declare class ScheduleService {
    private scheduleJobs;
    private schedulePreInSec;
    private getScheduleMessages;
    reScheduleMessages(page?: number): Promise<void>;
    scheduleMessages(scheduleMessages: IScheduleMessageModel[]): Promise<void>;
    removeScheduleJob(scheduleMessageId: string): void;
    private addMultipleMessageToQueue;
}
declare const _default: ScheduleService;
export default _default;
