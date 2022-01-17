import { HTTP400Error } from './lib/utils/httpErrors';
import express from "express";
/* Custom imports */
import {applyMiddleware, applyRoutes} from "./lib/utils";
import middleware from './lib/middleware/index'
import routes from "./routes";
import errorHandlersMiddleware from "./lib/middleware/errorHandlers.middleware";
import dbConnection from "./lib/helpers/dbConnection";

import { schedule } from 'node-cron';
// import { config } from "process";
/* Importing defaults */
// import "./lib/services/cache";
// Uncomment this when you are ready to use cache.

/* Error Handlers */
// These error handlers will caught any unhandled exceptions or rejections
// and do not stop the process with zero.
process.on("uncaughtException", e => {
    console.log(e)
  console.log(e.message, "uncaught");
  process.exit(1);
});

process.on("unhandledRejection", e => {
  console.log(e, "unhandled");
  process.exit(1);
});

// import csv from "csv-parser";
// import fs from "fs"
// import questionModel from "./components/question/question.model";
// const results:any = [];

//   fs.createReadStream("D:\\Quiz_data\\World_Organizations.csv")
//     .pipe(csv())
//     .on('data', (data: any) => {
//       const questionBody = {
//         'answer': data.answer_num,
//         'points': 10,
//         'isText': 'true',
//         'categoryId': '6175763454df7246bc6e053c',
//         'question': data.question,
//         'level': 2,
//         'options': [{ "isText": "true", "text": data.option1.split('.')[1] },
//         { "isText": "true", "text": data.option2.split('.')[1] },
//         { "isText": "true", "text": data.option3.split('.')[1] },
//         { "isText": "true", "text": data.option4.split('.')[1] }]
//       }

//       results.push(questionBody);
//     })
//     .on('end', () => {
//       results.forEach(async (data: any) => {
//         await questionModel.create(data, '6155b8be8bc31d20609c4ce9')
//       });
//       console.log("end");
//     });

// Initialize express app
const app: express.Application = express();

// Initialize middleware
applyMiddleware(middleware, app);

// open  mongoose connection
dbConnection.mongoConnection();

/*---------------------------------------
| API VERSIONS CONFIGURATION [START]
|---------------------------------------*/

// Different router required to initialize different apis call.
const r1 = express.Router();

// for recurrent jobs
// schedule('* * * * *', async () => {
//   console.log("Running job......");
// });

// schedule('* * * * *', async () => {
//   console.log("Running job 2......");
// });

app.use("/multi", applyRoutes(routes, r1)); // default api
app.all("*", (req, res, next) => {
  // res.send("hii");
  next(new HTTP400Error(`Can't found ${req.originalUrl} on  server`));
});
console.log("current env is ",process.env.NODE_ENV );

/*---------------------------------------git push -u myorigin
| API VERSIONS CONFIGURATION [END]
|---------------------------------------*/

applyMiddleware(errorHandlersMiddleware, app);


// Exporting app
export {app};