"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverError = exports.clientError = exports.notFoundError = void 0;
const httpErrors_1 = require("./httpErrors");
const responseHandler_1 = __importDefault(require("../helpers/responseHandler"));
const logger_1 = __importDefault(require("../../core/logger"));
const logFileName = "[ErrorHandler] : ";
// When specific api path is not available then throw 404 error. we are passing
// the errors to next function.
const notFoundError = () => {
    throw new httpErrors_1.HTTP404Error("Method not found.");
};
exports.notFoundError = notFoundError;
// Handles client side error, If not moved to next function.
const clientError = (err, req, res, next) => {
    const responseHandler = new responseHandler_1.default();
    if (err instanceof httpErrors_1.HTTPClientError) {
        logger_1.default.error(logFileName, err);
        responseHandler.reqRes(req, res).onClientError(err.statusCode, err.name, err.message, err.description).send();
    }
    else {
        next(err);
    }
};
exports.clientError = clientError;
// handles server side error.
const serverError = (err, req, res, next) => {
    const responseHandler = new responseHandler_1.default();
    if (process.env.NODE_ENV === "production") {
        logger_1.default.error(logFileName, err);
        responseHandler.reqRes(req, res).onServerError(err.name, err.message).send();
    }
    else {
        res.status(500).send(err.stack);
    }
};
exports.serverError = serverError;
//# sourceMappingURL=errorHandlers.js.map