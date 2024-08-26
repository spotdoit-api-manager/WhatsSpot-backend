"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "development") {
    // cron.schedule('*/15 * * * *', async () => {
    //   // schedule your jobs
    // });
    console.log("Scheduled Cron Tab");
}
else {
    console.log("Not Setting Cron Tab");
}
//# sourceMappingURL=cron.js.map