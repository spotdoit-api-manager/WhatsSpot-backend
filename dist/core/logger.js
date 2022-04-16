"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const logFileName = '[Logger] : ';
Object.defineProperty(Array.prototype, 'insert', {
    value: function (index, item) {
        this.splice(index, 0, item);
    }
});
const logger = {
    info: function (...msg) {
        const dateTime = moment_1.default().format("DD-MMM-YY HH:MM:SS");
        msg.insert(0, '\x1b[45m');
        msg.insert(2, '\x1b[0m');
        console.info('\x1b[32m', `[${dateTime}]`, '\x1b[44m', ` [INFO]  `, ...msg);
    },
    error: function (...msg) {
        const dateTime = moment_1.default().format("DD-MMM-YY HH:MM:SS");
        msg.insert(0, '\x1b[45m');
        msg.insert(2, '\x1b[0m');
        console.error('\x1b[32m', `[${dateTime}]`, '\x1b[41m', ` [ERROR] `, ...msg);
    },
    warn: function (...msg) {
        const dateTime = moment_1.default().format("DD-MMM-YY HH:MM:SS");
        msg.insert(0, '\x1b[45m');
        msg.insert(2, '\x1b[0m');
        console.warn('\x1b[32m', `[${dateTime}]`, '\x1b[43m', ` [WARN]  `, ...msg);
    },
    success: function (...msg) {
        const dateTime = moment_1.default().format("DD-MMM-YY HH:MM:SS");
        msg.insert(0, '\x1b[45m');
        msg.insert(2, '\x1b[0m');
        console.log('\x1b[32m', `[${dateTime}]`, '\x1b[42m', `[SUCCESS]`, ...msg);
    }
};
logger.error(logFileName, "Testing Error-------------------------");
logger.success(logFileName, "Testing Success-------------------------");
logger.info(logFileName, "Testing info-------------------------");
logger.warn(logFileName, "Testing Warn-------------------------");
exports.default = logger;
//# sourceMappingURL=logger.js.map