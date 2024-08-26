import { Router } from "express";
export declare const useHelmet: (router: Router) => void;
export declare const allowCors: (router: Router) => void;
export declare const allowCorsApi: (router: Router) => void;
export declare const allowCorsAdmin: (router: Router) => void;
export declare const handleBodyRequestParsing: (router: Router) => void;
export declare const reqConsoleLogger: (router: Router) => void;
export declare const handleCompression: (router: Router) => void;
export declare const requestLimiter: (router: Router) => void;
