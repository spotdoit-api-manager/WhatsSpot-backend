import { handleBodyRequestParsing, reqConsoleLogger,handleCompression, useHelmet } from "./common.middleware";

export default [useHelmet,handleBodyRequestParsing, reqConsoleLogger, handleCompression];
// add request limiter ->pending