"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.requestLogger = (req, res, next) => {
    util_1.log(green(`${req.method} ${req.originalUrl}`));
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
const reqConsoleLogger = (logValue) => {
    const { status, method, url, time } = logValue;
    if (status < 400) {
        util_1.log(green(`${method} ${url} -> `) + bgGreen(`${status}`) + cyan(` ${time}ms`));
    }
    else if (status < 500) {
        util_1.log(yellow(`${method} ${url} -> `) + bgYellow(`${status}`) + cyan(` ${time}ms`));
    }
    else {
        util_1.log(red(`${method} ${url} -> `) + bgRed(`${status}`) + cyan(` ${time}ms`));
    }
};
//# sourceMappingURL=requestLogger.js.map