import { IMessage } from "./../../components/messages/message.interface";
import messageQueueService  from "./whatsapp/message-queue.service";
import  messageModel  from "./../../components/messages/message.model";
import cron from "node-cron";
import dayjs from "dayjs";
import { IMessageModel, IScheduleMessageModel, MessageQueue, ScheduleMessage } from "./../../components/messages/message.schema";
import logger from "../utils/logger";

export class ScheduleService {
    private scheduleJobs = {
        // "scheduleMessageId": job
    }
    // schedule pre 30  seconds
    private schedulePreInSec = 30;
    private getScheduleMessages(page: number = 1) {
        return ScheduleMessage.find({}).limit(50).skip((page - 1) * 50);
    }

    public async reScheduleMessages(page=1) {
        const messages = await this.getScheduleMessages(page);

        for(const message of messages) {
            const scheduleTime = message.scheduleTime;
            // get the difference between the schedule time and now
            const diff = scheduleTime.getTime() - new Date().getTime();
            if(diff > 0) {
                // schedule the message
                this.scheduleMessages([message]);
            }
            if(Math.abs(diff) <= 600000) {
                message.scheduleTime = new Date(new Date().getTime() + 120000);
                await message.save();
                this.scheduleMessages([message]);
            }
        }

        if(messages.length === 50) {
            page++;
            this.reScheduleMessages(page);
        }
    }

    public async scheduleMessages(scheduleMessages: IScheduleMessageModel[]) {
        for(const scheduleMessage of scheduleMessages) {

            // get minutes and subtract 30 seconds
            const scheduleTime = new Date(scheduleMessage.scheduleTime.getTime() - (this.schedulePreInSec * 1000));
            const cronTime = `${scheduleTime.getSeconds()} ${scheduleTime.getMinutes()} ${scheduleTime.getHours()} ${scheduleTime.getDate()} ${scheduleTime.getMonth() + 1} *`;
        logger.info(`Scheduling message with cron time ${cronTime}`);
        const job = cron.schedule(cronTime, async () => {
            delete scheduleMessage._id;
            const queueMessage = scheduleMessage as unknown as IMessageModel;
            console.log(queueMessage);
            // delete message from scheduleCOllection
            await this.addMultipleMessageToQueue([queueMessage]);
            await ScheduleMessage.deleteOne({ _id: scheduleMessage._id });
        });
        this.scheduleJobs[scheduleMessage._id] = job;
        }
    }

    public removeScheduleJob(scheduleMessageId: string) {
        if(this.scheduleJobs[scheduleMessageId]) {
            this.scheduleJobs[scheduleMessageId].stop();
            delete this.scheduleJobs[scheduleMessageId];
        }
    }

    private async addMultipleMessageToQueue(messages: IMessage[]) {
        // remove _id from the message
       
        const result = await MessageQueue.insertMany(messages);
        if (result) {
            return { error: false,result };
        }
        return { error: true, message: "NOT_ADDED" };
    }
    
}

export default new ScheduleService();