"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const http_1 = require("http");
// Initializing the dot env file very early of this project to use every where
dotenv_1.config({ path: './config.env' });
// calling app to create server :: Our logics will belong to this app.
const app_1 = require("./app");
const socket_1 = require("./lib/services/socket");
// Set PORT in .env or use 3000 by default  
const Port = process.env.PORT ? +process.env.PORT : 8000;
// // Create http server [non ssl]
const server = http_1.createServer(app_1.app);
socket_1.socketServer(server);
server.listen(Port, () => {
    console.log(`Listening to port ${Port}`);
});
//# sourceMappingURL=server.js.map