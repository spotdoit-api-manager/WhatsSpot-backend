"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLimiter = exports.handleCompression = exports.reqConsoleLogger = exports.handleBodyRequestParsing = exports.allowCorsAdmin = exports.allowCorsApi = exports.allowCors = exports.useHelmet = void 0;
const express_1 = require("express");
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
/* Custom imports */
const config_1 = require("../../config");
const requestLogger_1 = require("./requestLogger");
const useHelmet = (router) => {
    router.use((0, helmet_1.default)());
};
exports.useHelmet = useHelmet;
const allowCors = (router) => {
    router.use((0, cors_1.default)({
        origin(origin, callback) {
            if (process.env.NODE_ENV == "development" && !origin) {
                return callback(null, true);
            }
            if (config_1.configCors.allowOrigin.indexOf(origin) === -1) {
                const msg = "The CORS policy for this site does not allow access from the specified Origin to WhatsSpot.";
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        exposedHeaders: config_1.configCors.exposedHeaders,
        // To enable HTTP cookies over CORS
        // credentials: true,
    }));
};
exports.allowCors = allowCors;
const allowCorsApi = (router) => {
    router.use((0, cors_1.default)({
        origin(origin, callback) {
            if (!origin) {
                return callback(null, true);
            }
            // if (configCors.allowOrigin.indexOf(origin) === -1) {
            //   const msg = "The CORS policy for this site does not allow access from the specified Origin to whatsspot api.";
            //   return callback(new Error(msg), false);
            // }
            return callback(null, true);
        },
        exposedHeaders: config_1.configCors.exposedHeaders,
        // To enable HTTP cookies over CORS
        // credentials: true,
    }));
};
exports.allowCorsApi = allowCorsApi;
const allowCorsAdmin = (router) => {
    router.use((0, cors_1.default)({
        origin(origin, callback) {
            if (process.env.NODE_ENV == "development" && !origin) {
                return callback(null, true);
            }
            if (config_1.configCors.adminAllowOrigin.indexOf(origin) === -1) {
                const msg = "The CORS policy for this site does not allow access from the specified Origin to WhatsSpot Admin.";
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        exposedHeaders: config_1.configCors.exposedHeaders,
        // To enable HTTP cookies over CORS
        // credentials: true,
    }));
};
exports.allowCorsAdmin = allowCorsAdmin;
/* here all middleware come. Don't need to do anything in app.js*/
const handleBodyRequestParsing = (router) => {
    router.use((0, express_1.urlencoded)({ extended: true }));
    router.use((0, express_1.json)());
};
exports.handleBodyRequestParsing = handleBodyRequestParsing;
// Logging all request in console.
const reqConsoleLogger = (router) => {
    router.use(requestLogger_1.requestLogger);
};
exports.reqConsoleLogger = reqConsoleLogger;
// Compress the payload and send through api
const handleCompression = (router) => {
    router.use((0, compression_1.default)());
};
exports.handleCompression = handleCompression;
const requestLimiter = (router) => {
    const limiter = (0, express_rate_limit_1.default)({
        windowMs: +config_1.rateLimitConfig.inTime,
        max: +config_1.rateLimitConfig.maxRequest,
        message: {
            status: 0,
            error: "TOO_MANY_REQUESTS",
            statusCode: 429,
            message: "Oh ! You look in hurry, take it easy",
            description: "You have crossed maximum number of requests. please wait and try again."
        }
    });
    router.use(limiter);
};
exports.requestLimiter = requestLimiter;
//# sourceMappingURL=common.middleware.js.map