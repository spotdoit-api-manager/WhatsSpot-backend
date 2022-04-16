

import fs from 'fs';
import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';

const logFileName = '[Logger] : ';
Object.defineProperty(Array.prototype, 'insert', {
    value:function ( index:number, item:string ) {
        this.splice( index, 0, item );
    }
});

// logs dir
const logDir = __dirname + '/../logs';

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Define log format
const logFormat = winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`);

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize(),

    winston.format.timestamp({
      format: 'DD-MM-YYYY HH:mm:ss',
    }),
    logFormat,
  ),
  transports: [
    // debug log setting
    new winstonDaily({
      level: process.env.NODE_ENV === "production" ? "error" : "debug",
      datePattern: 'DD-MM-YYYY',
      dirname: logDir + '/debug', // log file /logs/debug/*.log in save
      filename: `%DATE%.log`,
      maxFiles: 30, // 30 Days saved
      json: false,
      zippedArchive: true,
    }),
    // error log setting
    new winstonDaily({
      level: 'error',
      datePattern: 'DD-MM-YYYY',
      dirname: logDir + '/error', // log file /logs/error/*.log in save
      filename: `%DATE%.log`,
      maxFiles: 30, // 30 Days saved
      handleExceptions: true,
      json: false,
      zippedArchive: true,
    }),
  ],
});

logger.add(
  new winston.transports.Console({
    format: winston.format.combine(winston.format.splat(), winston.format.colorize()),
  }),
);

const wrapper = ( original ) => {
    return (...args:any) => {
        args.forEach((arg,index)=>{
            if(typeof arg === 'object'){
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
  write: (message: string) => {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  },
};

if (process.env.NODE_ENV !== "production") {
  logger.debug("Logging initialized at debug level");
}

// export  logger, stream };
export default logger;
