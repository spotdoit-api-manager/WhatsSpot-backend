import { handleBodyRequestParsing, reqConsoleLogger,handleCompression, useHelmet, requestLimiter } from "./common.middleware";

export default [useHelmet,handleBodyRequestParsing, requestLimiter, reqConsoleLogger, handleCompression];
// add request limiter ->pending