"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const chalk = __importStar(require("chalk"));
const config_1 = require("../../config");
const logger_1 = __importDefault(require("../../core/logger"));
//require database URL from properties file
const logFileName = "[DBConnection] : ";
const connected = chalk.default.bold.cyan;
const error = chalk.default.bold.yellow;
const disconnected = chalk.default.bold.red;
const termination = chalk.default.bold.magenta;
class Connection {
    constructor(uri) {
        this.mongoUrl = uri;
    }
    mongoConnection() {
        logger_1.default.info(logFileName, "Connecting to MongoDB...");
        const dbURL = this.mongoUrl;
        (0, mongoose_1.connect)(dbURL, this.mongoOption());
        mongoose_1.connection.on("connected", () => {
            console.log(connected("Mongoose default connection is open to ", dbURL, "\u{1F60D}"));
        });
        mongoose_1.connection.on("error", (err) => {
            console.log(error("Mongoose default connection has occured " + err + " error"));
        });
        mongoose_1.connection.on("disconnected", () => {
            console.log(disconnected("Mongoose default connection is disconnected"));
        });
        process.on("SIGINT", () => {
            mongoose_1.connection.close(() => {
                console.log(termination("Mongoose default connection is disconnected due to application termination"));
                process.exit(0);
            });
        });
    }
    mongoOption() {
        return {
            // absolutely copied from mongoose docs. 
            // Change according to your need
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            // autoIndex: false, // Don't build indexes
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 500,
            poolSize: 10,
            // If not connected, return errors immediately rather than waiting for reconnect
            bufferMaxEntries: 0,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            family: 4 // Use IPv4, skip trying IPv6
        };
    }
}
exports.default = new Connection((0, config_1.mongoUrl)());
//# sourceMappingURL=dbConnection.js.map