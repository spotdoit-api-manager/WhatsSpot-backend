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
const exchange_rate_service_1 = require("./lib/services/exchange-rate.service");
const dotenv_1 = require("dotenv");
const http_1 = require("http");
// Initializing the dot env file very early of this project to use every where
(0, dotenv_1.config)({ path: "./config.env" });
// calling app to create server :: Our logics will belong to this app.
const app_1 = require("./app");
const whatsapp_client_service_1 = __importDefault(require("./lib/services/whatsapp/whatsapp-client.service"));
const socket_1 = __importDefault(require("./lib/services/socket"));
const schedular_1 = __importDefault(require("./lib/services/schedular"));
const logger_1 = __importDefault(require("./lib/utils/logger"));
const message_queue_service_1 = __importDefault(require("./lib/services/whatsapp/message-queue.service"));
const logFileName = "[Server]: ";
// Set PORT in .env or use 3000 by default  
const Port = process.env.PORT ? +process.env.PORT : 8000;
// // Create http server [non ssl]
const server = (0, http_1.createServer)(app_1.app);
socket_1.default.socketServer(server);
process.on("unhandledRejection", (reason, p) => {
    console.log("Unhandled Rejection at: Promise ", p, " reason: ", reason);
    // application specific logging, throwing an error, or other logic here
});
process.on("uncaughtException", function (exception) {
    console.log(exception);
});
server.listen(Port, () => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info(`Listening to port ${Port}`);
    yield (0, exchange_rate_service_1.startExchangeRateService)();
    if (process.env.NODE_ENV === "production") {
        whatsapp_client_service_1.default.initializeAllClients();
        message_queue_service_1.default.start();
        schedular_1.default.reScheduleAllApiExpiration();
        schedular_1.default.reScheduleAllUserPlanExpiration();
    }
    else {
        logger_1.default.warn(logFileName, "Scheduling is disabled in Development mode");
    }
}));
//# sourceMappingURL=server.js.map