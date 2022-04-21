import Moment from "moment-timezone";
import cron from "node-cron";

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "development") {
  // cron.schedule('*/15 * * * *', async () => {
  //   // schedule your jobs
  // });
  console.log("Scheduled Cron Tab");
} else {
  console.log("Not Setting Cron Tab");
}
