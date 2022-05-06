export declare abstract class HTTPClientError extends Error {
    readonly statusCode: number;
    readonly name: string;
    readonly description?: string;
    constructor(message: object | string, description?: string);
}
export declare class HTTP400Error extends HTTPClientError {
    readonly statusCode = 400;
    constructor(message?: string | object, description?: string);
}
export declare class HTTP200Error extends HTTPClientError {
    readonly statusCode = 200;
    constructor(message?: string | object, description?: string);
}
export declare class HTTP401Error extends HTTPClientError {
    readonly statusCode = 401;
    constructor(message?: string | object, description?: string);
}
export declare class HTTP403Error extends HTTPClientError {
    readonly statusCode = 403;
    constructor(message?: string | object, description?: string);
}
export declare class HTTP404Error extends HTTPClientError {
    readonly statusCode = 404;
    constructor(message?: string | object, description?: string);
}
export declare class HTTP409Error extends HTTPClientError {
    readonly statusCode = 409;
    constructor(message?: string | object, description?: string);
}
