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

// Set PORT in .env or use 3000 by default  
const Port: number = process.env.PORT ? + process.env.PORT : 8000;

// // Create http server [non ssl]
const server = createServer(app);

socketManager.socketServer(server);

server.listen(Port, () => {
    console.log(`Listening to port ${Port}`);
    if(process.env.NODE_ENV === "production") {
        whatsappClientService.initializeAllClients();
    }
        spotSchedular.reScheduleAllApiExpiration();

    // dash.monitor({server: server});
});


