"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleService = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const message_schema_1 = require("./../../components/messages/message.schema");
const logger_1 = __importDefault(require("../utils/logger"));
class ScheduleService {
    constructor() {
        this.scheduleJobs = {
        // "scheduleMessageId": job
        };
        // schedule pre 30  seconds
        this.schedulePreInSec = 30;
    }
    getScheduleMessages(page = 1) {
        return message_schema_1.ScheduleMessage.find({}).limit(50).skip((page - 1) * 50);
    }
    reScheduleMessages(page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = yield this.getScheduleMessages(page);
            for (const message of messages) {
                const scheduleTime = message.scheduleTime;
                // get the difference between the schedule time and now
                const diff = scheduleTime.getTime() - new Date().getTime();
                if (diff > 0) {
                    // schedule the message
                    this.scheduleMessages([message]);
                }
                if (Math.abs(diff) <= 600000) {
                    message.scheduleTime = new Date(new Date().getTime() + 120000);
                    yield message.save();
                    this.scheduleMessages([message]);
                }
            }
            if (messages.length === 50) {
                page++;
                this.reScheduleMessages(page);
            }
        });
    }
    scheduleMessages(scheduleMessages) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const scheduleMessage of scheduleMessages) {
                // get minutes and subtract 30 seconds
                const scheduleTime = new Date(scheduleMessage.scheduleTime.getTime() - (this.schedulePreInSec * 1000));
                const cronTime = `${scheduleTime.getSeconds()} ${scheduleTime.getMinutes()} ${scheduleTime.getHours()} ${scheduleTime.getDate()} ${scheduleTime.getMonth() + 1} *`;
                logger_1.default.info(`Scheduling message with cron time ${cronTime}`);
                const job = node_cron_1.default.schedule(cronTime, () => __awaiter(this, void 0, void 0, function* () {
                    delete scheduleMessage._id;
                    const queueMessage = scheduleMessage;
                    console.log(queueMessage);
                    // delete message from scheduleCOllection
                    yield this.addMultipleMessageToQueue([queueMessage]);
                    yield message_schema_1.ScheduleMessage.deleteOne({ _id: scheduleMessage._id });
                }));
                this.scheduleJobs[scheduleMessage._id] = job;
            }
        });
    }
    removeScheduleJob(scheduleMessageId) {
        if (this.scheduleJobs[scheduleMessageId]) {
            this.scheduleJobs[scheduleMessageId].stop();
            delete this.scheduleJobs[scheduleMessageId];
        }
    }
    addMultipleMessageToQueue(messages) {
        return __awaiter(this, void 0, void 0, function* () {
            // remove _id from the message
            const result = yield message_schema_1.MessageQueue.insertMany(messages);
            if (result) {
                return { error: false, result };
            }
            return { error: true, message: "NOT_ADDED" };
        });
    }
}
exports.ScheduleService = ScheduleService;
exports.default = new ScheduleService();
//# sourceMappingURL=schedule.service.js.map