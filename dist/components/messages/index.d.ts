/// <reference types="qs" />
/// <reference types="express" />
declare const _default: {
    path: string;
    method: string;
    escapeAuth: boolean;
    handler: ((req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: import("express").Response<any, Record<string, any>>, next: import("express").NextFunction) => void)[];
}[];
export default _default;
