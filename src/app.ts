import { HTTP400Error } from "./lib/utils/httpErrors";
import express from "express";
/* Custom imports */
import {applyMiddleware, applyRoutes} from "./lib/utils";
import middleware from "./lib/middleware/index";
import routes from "./routes";
import apiRoutes from "./routes/api-routes";
import adminRoutes from "./routes/admin-routes";

import errorHandlersMiddleware from "./lib/middleware/errorHandlers.middleware";
import dbConnection from "./lib/helpers/dbConnection";

import { schedule } from "node-cron";
import logger from "./core/logger";
import { allowCors, allowCorsAdmin, allowCorsApi } from "./lib/middleware/common.middleware";
import ResponseHandler from "./lib/helpers/responseHandler";
import stripeEvents from "./components/stripe/stripe.events";
const logFileName = "[App]";





// Initialize express app
const app: express.Application = express();

// Initialize middlewares
applyMiddleware(middleware, app); //apply common middle wares

// open  mongoose connection
dbConnection.mongoConnection();

/*---------------------------------------
| API VERSIONS CONFIGURATION [START]
|---------------------------------------*/
// Different router required to initialize different apis call.

//!USER API ROUTER
const userApiRouter = express.Router();
applyMiddleware([allowCorsApi],userApiRouter); //apply cors to only base endpoints

app.use("/api", applyRoutes(apiRoutes, userApiRouter)); // users api
userApiRouter.all("*", (req, res, next) => {
  const responseHandler = new ResponseHandler();
  responseHandler.reqRes(req, res).onFetch("API IS ACTIVE","Hurray!! Everything seems to be fine on WhatsSpot Server").send();
});


//!APP BASE ROUTER
const baseAppRouter = express.Router();
applyMiddleware([allowCors],baseAppRouter); //apply cors to only base endpoints
app.use("/", applyRoutes(routes, baseAppRouter)); // base app api

const stripeEventsRouter = express.Router();

app.use("/stripe-event", applyRoutes(stripeEvents, stripeEventsRouter)); // base app api

//!ADMIN ROUTER
const adminRouter = express.Router();
applyMiddleware([allowCorsAdmin],adminRouter); //apply cors to admin api
app.use("/admin", applyRoutes(adminRoutes, adminRouter)); // admin api



app.all("*", (req, res, next) => {
  next(new HTTP400Error(`Can't found ${req.originalUrl} on WhatsSpot server`));
});
console.log("current env is ",process.env.NODE_ENV );

/*---------------------------------------git push -u myorigin
| API VERSIONS CONFIGURATION [END]
|---------------------------------------*/

applyMiddleware(errorHandlersMiddleware, app);



// Exporting app
export {app};