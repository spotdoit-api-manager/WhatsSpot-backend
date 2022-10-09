"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const util_1 = require("util");
const chalk_1 = __importDefault(require("chalk"));
const red = chalk_1.default.redBright;
const green = chalk_1.default.greenBright;
const yellow = chalk_1.default.yellowBright;
const cyan = chalk_1.default.cyanBright.bold;
const bgRed = chalk_1.default.bgRedBright;
const bgGreen = chalk_1.default.bgGreenBright;
const bgYellow = chalk_1.default.bgYellow;
const requestLogger = (req, res, next) => {
    (0, util_1.log)(green(`${req.method} ${req.originalUrl}`));
    const start = new Date().getTime();
    res.on("finish", () => {
        const elapsed = new Date().getTime() - start;
        reqConsoleLogger({
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            time: elapsed
        });
    });
    next();
};
exports.requestLogger = requestLogger;
const reqConsoleLogger = (logValue) => {
    const { status, method, url, time } = logValue;
    if (status < 400) {
        (0, util_1.log)(green(`${method} ${url} -> `) + bgGreen(`${status}`) + cyan(` ${time}ms`));
    }
    else if (status < 500) {
        (0, util_1.log)(yellow(`${method} ${url} -> `) + bgYellow(`${status}`) + cyan(` ${time}ms`));
    }
    else {
        (0, util_1.log)(red(`${method} ${url} -> `) + bgRed(`${status}`) + cyan(` ${time}ms`));
    }
};
//# sourceMappingURL=requestLogger.js.map