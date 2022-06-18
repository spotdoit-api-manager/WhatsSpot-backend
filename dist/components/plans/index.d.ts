/// <reference types="express" />
declare const _default: ({
    path: string;
    method: string;
    role: string;
    handler: ((req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>)[];
    escapeAuth?: undefined;
} | {
    path: string;
    method: string;
    escapeAuth: boolean;
    handler: ((req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>)[];
    role?: undefined;
})[];
export default _default;
