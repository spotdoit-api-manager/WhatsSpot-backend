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
// import { config } from "process";
/* Importing defaults */
// import "./lib/services/cache";
// Uncomment this when you are ready to use cache.
/* Error Handlers */
// These error handlers will caught any unhandled exceptions or rejections
// and do not stop the process with zero.
process.on("uncaughtException", e => {
    console.log(e);
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
const app = express_1.default();
exports.app = app;
// Initialize middleware
utils_1.applyMiddleware(index_1.default, app);
// open  mongoose connection
dbConnection_1.default.mongoConnection();
/*---------------------------------------
| API VERSIONS CONFIGURATION [START]
|---------------------------------------*/
// Different router required to initialize different apis call.
const r1 = express_1.default.Router();
// for recurrent jobs
// schedule('* * * * *', async () => {
//   console.log("Running job......");
// });
// schedule('* * * * *', async () => {
//   console.log("Running job 2......");
// });
app.use("/multi", utils_1.applyRoutes(routes_1.default, r1)); // default api
app.all("*", (req, res, next) => {
    // res.send("hii");
    next(new httpErrors_1.HTTP400Error(`Can't found ${req.originalUrl} on  server`));
});
console.log("current env is ", process.env.NODE_ENV);
/*---------------------------------------git push -u myorigin
| API VERSIONS CONFIGURATION [END]
|---------------------------------------*/
utils_1.applyMiddleware(errorHandlers_middleware_1.default, app);
//# sourceMappingURL=app.js.map