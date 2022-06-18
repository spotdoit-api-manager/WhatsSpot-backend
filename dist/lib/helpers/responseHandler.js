"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httpErrors_1 = require("../utils/httpErrors");
class ResponseHandler {
    constructor() {
        this.status = 1;
        this.statusCode = 200;
        this.message = "Success";
    }
    setData(message, payload, description) {
        this.message = message || "successful";
        this.description = description || undefined;
        this.payload = payload || undefined;
        this.error = undefined;
    }
    setErrorData(error, message, description) {
        this.message = message;
        this.description = description;
        this.error = error;
    }
    // Call this method when creating any data into database
    // Assign custom messages and descriptions.
    reqRes(req, res) {
        this.req = req;
        this.res = res;
        return this;
    }
    onCreate(message, payload, description) {
        this.statusCode = 201;
        this.status = 1;
        this.setData(message, payload, description);
        return this;
    }
    onFetch(message, payload, description) {
        this.statusCode = 200;
        this.status = 1;
        this.setData(message, payload, description);
        return this;
    }
    onWrite(payload) {
        this.statusCode = 200;
        this.status = 1;
        this.payload = payload;
        return this;
    }
    onClientError(statusCode, error, message, description) {
        this.statusCode = statusCode || 400;
        this.status = 0;
        this.setErrorData(error, message, description);
        this.payload = undefined;
        return this;
    }
    onServerError(error, message, description) {
        this.statusCode = 500;
        this.status = 0;
        this.setErrorData(error, message, description);
        this.payload = undefined;
        return this;
    }
    /**
     * Send response to the client. This will be unique for all response. and
     * it can make things very easy for us. For debugging, logging, future
     * changes and etc. Please feel free to enhance the way.
     */
    send() {
        if (!this.req || !this.res) {
            throw new Error("please set req Res function to get start");
        }
        const response = {
            status: this.status,
            error: this.error,
            statusCode: this.statusCode,
            message: this.message,
            description: this.description,
            payload: this.payload
        };
        // console.log("Sending Response");
        // console.log(this.payload);
        this.res.status(this.statusCode).json(response);
    }
    sendError(e) {
        if (e instanceof httpErrors_1.HTTP400Error) {
            return new httpErrors_1.HTTP400Error(e.message, e.description);
        }
        if (e instanceof httpErrors_1.HTTP401Error) {
            return new httpErrors_1.HTTP401Error(e.message, e.description);
        }
        if (e instanceof httpErrors_1.HTTP403Error) {
            return new httpErrors_1.HTTP403Error(e.message, e.description);
        }
        if (e instanceof httpErrors_1.HTTP404Error) {
            return new httpErrors_1.HTTP404Error(e.message, e.description);
        }
        if (e instanceof httpErrors_1.HTTP409Error) {
            return new httpErrors_1.HTTP409Error(e.message, e.description);
        }
        if (e.name === "ValidationError") {
            return new httpErrors_1.HTTP400Error(e.message, "Schema validation error.");
        }
        if (e.name === "MongoError") {
            return new httpErrors_1.HTTP400Error(e.message, "Schema validation error.");
        }
        console.log(e);
        return e;
    }
    end() {
        if (!this.req || !this.res) {
            throw new Error("please set req Res function to get start");
        }
        this.res.writeHead(this.statusCode, { "Content-Type": "text/html" });
        this.res.write(this.payload);
        this.res.end();
    }
}
exports.default = ResponseHandler;
//# sourceMappingURL=responseHandler.js.map