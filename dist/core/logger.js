"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const logFileName = "[Logger] : ";
Object.defineProperty(Array.prototype, "insert", {
    value: function (index, item) {
        this.splice(index, 0, item);
    }
});
// logs dir
const logDir = __dirname + "/../logs";
if (!fs_1.default.existsSync(logDir)) {
    fs_1.default.mkdirSync(logDir);
}
// Define log format
const logFormat = winston_1.default.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`);
/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston_1.default.createLogger({
    level: process.env.NODE_ENV === "production" ? "error" : "debug",
    format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp({
        format: "DD-MM-YYYY HH:mm:ss",
    }), logFormat),
    transports: [
        // debug log setting
        new winston_daily_rotate_file_1.default({
            level: process.env.NODE_ENV === "production" ? "error" : "debug",
            datePattern: "DD-MM-YYYY",
            dirname: logDir + "/debug",
            filename: "%DATE%.log",
            maxFiles: 30,
            json: false,
            zippedArchive: true,
        }),
        // error log setting
        new winston_daily_rotate_file_1.default({
            level: "error",
            datePattern: "DD-MM-YYYY",
            dirname: logDir + "/error",
            filename: "%DATE%.log",
            maxFiles: 30,
            handleExceptions: true,
            json: false,
            zippedArchive: true,
        }),
    ],
});
logger.add(new winston_1.default.transports.Console({
    format: winston_1.default.format.combine(winston_1.default.format.splat(), winston_1.default.format.colorize()),
}));
const wrapper = (original) => {
    return (...args) => {
        args.forEach((arg, index) => {
            if (typeof arg === "object") {
                args[index] = JSON.stringify(arg);
            }
        });
        return original(args.join(" "));
    };
};
logger.error = wrapper(logger.error);
logger.warn = wrapper(logger.warn);
logger.info = wrapper(logger.info);
logger.verbose = wrapper(logger.verbose);
logger.debug = wrapper(logger.debug);
logger.silly = wrapper(logger.silly);
const stream = {
    write: (message) => {
        logger.info(message.substring(0, message.lastIndexOf("\n")));
    },
};
if (process.env.NODE_ENV !== "production") {
    logger.debug("Logging initialized at debug level");
}
// export  logger, stream };
exports.default = logger;
//# sourceMappingURL=logger.js.map