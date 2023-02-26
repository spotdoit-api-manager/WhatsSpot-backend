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
const api_routes_1 = __importDefault(require("./routes/api-routes"));
const admin_routes_1 = __importDefault(require("./routes/admin-routes"));
const errorHandlers_middleware_1 = __importDefault(require("./lib/middleware/errorHandlers.middleware"));
const dbConnection_1 = __importDefault(require("./lib/helpers/dbConnection"));
const common_middleware_1 = require("./lib/middleware/common.middleware");
const responseHandler_1 = __importDefault(require("./lib/helpers/responseHandler"));
const stripe_events_1 = __importDefault(require("./components/stripe/stripe.events"));
const logFileName = "[App]";
// Initialize express app
const app = (0, express_1.default)();
exports.app = app;
// Initialize middlewares
(0, utils_1.applyMiddleware)(index_1.default, app); //apply common middle wares
// open  mongoose connection
dbConnection_1.default.mongoConnection();
/*---------------------------------------
| API VERSIONS CONFIGURATION [START]
|---------------------------------------*/
// Different router required to initialize different apis call.
//!USER API ROUTER
const userApiRouter = express_1.default.Router();
(0, utils_1.applyMiddleware)([common_middleware_1.allowCorsApi], userApiRouter); //apply cors to only base endpoints
app.use("/api", (0, utils_1.applyRoutes)(api_routes_1.default, userApiRouter)); // users api
userApiRouter.all("*", (req, res, next) => {
    const responseHandler = new responseHandler_1.default();
    responseHandler.reqRes(req, res).onFetch("API IS ACTIVE", "Hurray!! Everything seems to be fine on WhatsSpot Server").send();
});
//!APP BASE ROUTER
const baseAppRouter = express_1.default.Router();
(0, utils_1.applyMiddleware)([common_middleware_1.allowCors], baseAppRouter); //apply cors to only base endpoints
app.use("/", (0, utils_1.applyRoutes)(routes_1.default, baseAppRouter)); // base app api
const stripeEventsRouter = express_1.default.Router();
app.use("/stripe-event", (0, utils_1.applyRoutes)(stripe_events_1.default, stripeEventsRouter)); // base app api
//!ADMIN ROUTER
const adminRouter = express_1.default.Router();
(0, utils_1.applyMiddleware)([common_middleware_1.allowCorsAdmin], adminRouter); //apply cors to admin api
app.use("/admin", (0, utils_1.applyRoutes)(admin_routes_1.default, adminRouter)); // admin api
app.all("*", (req, res, next) => {
    next(new httpErrors_1.HTTP400Error(`Can't found ${req.originalUrl} on WhatsSpot server`));
});
console.log("current env is ", process.env.NODE_ENV);
/*---------------------------------------git push -u myorigin
| API VERSIONS CONFIGURATION [END]
|---------------------------------------*/
(0, utils_1.applyMiddleware)(errorHandlers_middleware_1.default, app);
//# sourceMappingURL=app.js.map