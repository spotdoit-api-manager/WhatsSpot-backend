declare const _default: ({
    path: string;
    method: string;
    handler: ((req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: import("express").Response<any, Record<string, any>>, next: import("express").NextFunction) => Promise<void>)[];
    escapeAuth?: undefined;
} | {
    path: string;
    method: string;
    escapeAuth: boolean;
    handler: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>[];
})[];
export default _default;
