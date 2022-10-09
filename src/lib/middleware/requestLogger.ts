import { Request, Response, NextFunction as Next } from "express";
import { log } from "util";
import chalk from "chalk";


const red = chalk.redBright;
const green = chalk.greenBright;
const yellow = chalk.yellowBright;
const cyan = chalk.cyanBright.bold;
const bgRed = chalk.bgRedBright;
const bgGreen = chalk.bgGreenBright;
const bgYellow = chalk.bgYellow;

interface Logger {
    method: string;
    url: string;
    status: number;
    time: number;
}

export const requestLogger = (req: Request, res: Response, next: Next) => {
    log(green(`${req.method} ${req.originalUrl}`));
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


const reqConsoleLogger = (logValue: Logger) => {
    const { status, method, url, time } = logValue;
    if (status < 400) {
        log(green(`${method} ${url} -> `) + bgGreen(`${status}`) + cyan(` ${time}ms`));
    } else if (status < 500) {
        log(yellow(`${method} ${url} -> `) + bgYellow(`${status}`) + cyan(` ${time}ms`));
    } else {
        log(red(`${method} ${url} -> `) + bgRed(`${status}`) + cyan(` ${time}ms`));
    }
};
