"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCompression = exports.reqConsoleLogger = exports.handleBodyRequestParsing = exports.allowCors = exports.useHelmet = void 0;
const express_1 = require("express");
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
/* Custom imports */
const config_1 = require("../../config");
const requestLogger_1 = require("./requestLogger");
exports.useHelmet = (router) => {
    router.use(helmet_1.default());
};
exports.allowCors = (router) => {
    router.use(cors_1.default({
        origin(origin, callback) {
            if (!origin) {
            }
            return callback(null, true);
            console.log(`Origin: ${origin}`, router);
            if (config_1.configCors.allowOrigin.indexOf(origin) === -1) {
                const msg = "The CORS policy for this site does not allow access from the specified Origin.";
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        exposedHeaders: config_1.configCors.exposedHeaders,
    }));
};
/* here all middleware come. Don't need to do anything in app.js*/
exports.handleBodyRequestParsing = (router) => {
    router.use(express_1.urlencoded({ extended: true }));
    router.use(express_1.json());
};
// Logging all request in console.
exports.reqConsoleLogger = (router) => {
    router.use(requestLogger_1.requestLogger);
};
// Compress the payload and send through api
exports.handleCompression = (router) => {
    router.use(compression_1.default());
};
// export const requestLimiter = (router: Router) => {
//   const limiter = new rateLimit({
//     windowMs: +rateLimitConfig.inTime, // 1 minutes
//     max: +rateLimitConfig.maxRequest, // limit each IP to 12 requests per windowMs,
//     message: {
//       status: 0,
//       error: "Too Many Requests",
//       statusCode: 429,
//       message: "Oh boy! You look in hurry, take it easy",
//       description: "You have crossed maximum number of requests. please wait and try again."
//     }
//   });
//   router.use(limiter);
// };
//# sourceMappingURL=common.middleware.js.map