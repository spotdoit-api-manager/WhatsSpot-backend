import { HTTP400Error } from "./lib/utils/httpErrors";
import express from "express";
/* Custom imports */
import {applyMiddleware, applyRoutes} from "./lib/utils";
import middleware from "./lib/middleware/index";
import routes from "./routes";
import apiRoutes from "./routes/api-routes";

import errorHandlersMiddleware from "./lib/middleware/errorHandlers.middleware";
import dbConnection from "./lib/helpers/dbConnection";

import { schedule } from "node-cron";
import logger from "./core/logger";
import { allowCors } from "./lib/middleware/common.middleware";
const logFileName = "[App]";



process.on("uncaughtException", e => {
    console.log(e);
  console.log(e.message, "uncaught Exception");
  process.exit(1);
});

process.on("unhandledRejection", e => {
  logger.info(logFileName,e);
  console.log("unhandled Rejection");
  process.exit(1);
});


// Initialize express app
const app: express.Application = express();

// Initialize middlewares
applyMiddleware(middleware, app);

// open  mongoose connection
dbConnection.mongoConnection();

/*---------------------------------------
| API VERSIONS CONFIGURATION [START]
|---------------------------------------*/
// Different router required to initialize different apis call.
const r1 = express.Router();
applyMiddleware([allowCors],r1); //apply cors to only base endpoints

const r2 = express.Router();

app.use("/", applyRoutes(routes, r1)); // base app api
app.use("/api", applyRoutes(apiRoutes, r2)); // users api

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