/// <reference types="express" />
declare const _default: ({
    path: string;
    method: string;
    escapeAuth: boolean;
    handler: ((req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void)[];
} | {
    path: string;
    method: string;
    handler: ((req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>)[];
    escapeAuth?: undefined;
})[];
export default _default;
