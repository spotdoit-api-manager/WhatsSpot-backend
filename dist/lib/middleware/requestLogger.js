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
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const chalk = __importStar(require("chalk"));
const util_1 = require("util");
const red = chalk.default.redBright;
const green = chalk.default.greenBright;
const yellow = chalk.default.yellowBright;
const cyan = chalk.default.cyanBright.bold;
const bgRed = chalk.default.bgRedBright;
const bgGreen = chalk.default.bgGreenBright;
const bgYellow = chalk.default.bgYellow;
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