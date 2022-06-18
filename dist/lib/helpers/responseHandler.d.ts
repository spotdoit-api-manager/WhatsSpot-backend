import { IErrorResponse } from "../utils/commonInterface";
import { Request, Response } from "express";
import { HTTP400Error, HTTP401Error, HTTP403Error, HTTP404Error, HTTP409Error } from "../utils/httpErrors";
interface ICustomError extends Error {
    errors?: any;
}
declare class ResponseHandler implements IErrorResponse {
    status: number;
    statusCode: number;
    error?: string;
    message: string;
    description?: string;
    payload?: any;
    req?: Request;
    res?: Response;
    setData(message: string, payload?: any, description?: string): void;
    setErrorData(error: string, message: string, description?: string): void;
    reqRes(req: Request, res: Response): this;
    onCreate(message: string, payload?: any, description?: string): this;
    onFetch(message: string, payload?: any, description?: string): this;
    onWrite(payload?: any): this;
    onClientError(statusCode: number, error: string, message: string, description?: string): this;
    onServerError(error: string, message: string, description?: string): this;
    /**
     * Send response to the client. This will be unique for all response. and
     * it can make things very easy for us. For debugging, logging, future
     * changes and etc. Please feel free to enhance the way.
     */
    send(): void;
    sendError(e: ICustomError): ICustomError | HTTP400Error | HTTP401Error | HTTP403Error | HTTP404Error | HTTP409Error;
    end(): void;
}
export default ResponseHandler;
