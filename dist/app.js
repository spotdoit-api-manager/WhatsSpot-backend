"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const httpErrors_1 = require("./lib/utils/httpErrors");
const express_1 = __importDefault(require("express"));
/* Custom imports */
const utils_1 = require("./lib/utils");
const index_1 = __importDefault(require("./lib/middleware/index"));
const routes_1 = __importDefault(require("./routes"));
const errorHandlers_middleware_1 = __importDefault(require("./lib/middleware/errorHandlers.middleware"));
const dbConnection_1 = __importDefault(require("./lib/helpers/dbConnection"));
process.on("uncaughtException", e => {
    console.log(e);
    console.log(e.message, "uncaught Exception");
    process.exit(1);
});
process.on("unhandledRejection", e => {
    console.log(e, "unhandled Rejection");
    process.exit(1);
});
// Initialize express app
const app = express_1.default();
exports.app = app;
// Initialize middlewares
utils_1.applyMiddleware(index_1.default, app);
// open  mongoose connection
dbConnection_1.default.mongoConnection();
/*---------------------------------------
| API VERSIONS CONFIGURATION [START]
|---------------------------------------*/
// Different router required to initialize different apis call.
const r1 = express_1.default.Router();
app.use("/", utils_1.applyRoutes(routes_1.default, r1)); // default api
app.all("*", (req, res, next) => {
    next(new httpErrors_1.HTTP400Error(`Can't found ${req.originalUrl} on services server`));
});
console.log("current env is ", process.env.NODE_ENV);
/*---------------------------------------git push -u myorigin
| API VERSIONS CONFIGURATION [END]
|---------------------------------------*/
utils_1.applyMiddleware(errorHandlers_middleware_1.default, app);
//# sourceMappingURL=app.js.map