import { startExchangeRateService } from "./lib/services/exchange-rate.service";
import { config } from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";


// Initializing the dot env file very early of this project to use every where
config({ path: "./config.env" });

// calling app to create server :: Our logics will belong to this app.
import { app } from "./app";
import whatsappClientService from "./lib/services/whatsapp/whatsapp-client.service";
import socketManager from "./lib/services/socket";
import spotSchedular from "./lib/services/schedular";
import logger from "./lib/utils/logger";

const logFileName = "[Server]: ";
// Set PORT in .env or use 3000 by default  
const Port: number = process.env.PORT ? + process.env.PORT : 8000;

// // Create http server [non ssl]
const server = createServer(app);

socketManager.socketServer(server);

process.on("unhandledRejection", (reason, p) => {
    console.log("Unhandled Rejection at: Promise ", p, " reason: ", reason);
    // application specific logging, throwing an error, or other logic here
  });
  
  process.on("uncaughtException", function (exception) {
    console.log(exception); 
  });

  
server.listen(Port, async() => {
    logger.info(`Listening to port ${Port}`);
    await startExchangeRateService();
    whatsappClientService.initializeAllClients();
    if(process.env.NODE_ENV === "production") {
        spotSchedular.reScheduleAllApiExpiration();
        spotSchedular.reScheduleAllUserPlanExpiration();
    }else{
        logger.warn(logFileName,"Scheduling is disabled in Development mode");
    }
});


