"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testMessageConfig = exports.fast2SmsConfig = exports.pilvoConfig = exports.razorPaySecrets = exports.googleOAuth = exports.paginationConfig = exports.s3Config = exports.stripeConfig = exports.mailazyConfig = exports.textLocalConfig = exports.deviceKeyConfig = exports.commonConfig = exports.rateLimitConfig = exports.configCors = exports.mongoUrl = void 0;
const mongoUrl = () => {
    const configs = {
        dbAccess: process.env.DB_ACCESS || "local",
        user: process.env.DB_USER || "",
        pass: process.env.DB_PASS || "",
        cluster: process.env.DB_CLUSTER || "",
        db: process.env.DB || "pol-bol"
    };
    if (configs.dbAccess === "local") {
        return `mongodb://localhost:27017/${configs.db}`;
    }
    return `mongodb+srv://${configs.user}:${configs.pass}@${configs.cluster}.mongodb.net/${configs.db}?retryWrites=true`;
};
exports.mongoUrl = mongoUrl;
exports.configCors = {
    // Allow your domains to restrict ill apis.
    adminAllowOrigin: [
        "http://localhost:4200",
        "https://admin.whatsspot.in",
    ],
    allowOrigin: [
        "http://localhost:4200",
        "http://localhost:56217",
        "https://securegw.paytm.in",
        "https://spotdoit.in",
        "https://dashboard.whatsspot.in",
        "https://whatsspot.in",
        "https://admin.whatsspot.in",
        //add your origin
    ],
    // Expose additional which are restricted.
    exposedHeaders: ["X-Auth", "Set-Cookie"]
};
exports.rateLimitConfig = {
    inTime: process.env.REQUEST_TIME || 60 * 1000,
    maxRequest: process.env.MAX_REQUEST || 60
};
exports.commonConfig = {
    jwtSecretKey: process.env.SECRET_KEY || "some-secret-key",
    pageSizeLimit: 15,
    domain: process.env.NODE_ENV === "production" ? "https://dashboard.whatsspot.in" : "http://localhost:4200",
    backendUrl: process.env.NODE_ENV === "production" ? "https://backend.whatsspot.in" : "http://localhost:4250",
    deviceNotUsedMaxDay: 15,
};
exports.deviceKeyConfig = {
    jwtSecretKey: process.env.SECRET_KEY || "some-secret-key",
    expiresIn: process.env.JWT_EXPIRES_IN,
};
exports.textLocalConfig = {
    apiKey: process.env.TEXTLOCAL_KEY
};
exports.mailazyConfig = {
    accessKey: process.env.MAILAZY_KEY,
    accessSecret: process.env.MAILAZY_SECRET
};
exports.stripeConfig = {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    webhookSecretKey: process.env.STRIPE_WEBHOOK_SECRET_KEY,
    API: process.env.STRIPE_API
};
exports.s3Config = {
    accessKey: process.env.S3_ACCEESS_ID || "",
    secretKey: process.env.S3_SECRET_KEY || "",
    sign: process.env.S3_SIGN_VERSION || "v4",
    region: process.env.S3_REGION || "us-east-1",
    url: process.env.S3_URL || "",
};
exports.paginationConfig = {
    MAX_NEWS: 30,
    MAX_VIDEOS: 30,
    MAX_POLL: 15,
    MAX_POST: 30,
    MAX_TIMELINE: 30,
    MAX_LIKES: 100,
    MAX_COMMENTS: 30,
    MAX_REPLIES: 5,
    MAX_USERS: 100,
    MAX_AWARDS: 15,
    MAX_NOTIFICATIONS: 50
};
exports.googleOAuth = {
    CLIENT_ID: "737333346336-s4mkj3ud2l79rug8tgg7u1u1231g6u94.apps.googleusercontent.com",
    CLIENT_SECRET: "xOE1E9P46fTZo2Kwq6UsE7Rs",
    REDIRECT: "http://ec2-13-235-90-125.ap-south-1.compute.amazonaws.com:2112/api/v1/user/login/socialAuth/google/callBack"
};
exports.razorPaySecrets = {
    key: process.env.RazorPay_KEY,
    secret: process.env.RazorPay_SECRET
};
exports.pilvoConfig = {
    authId: process.env.PILVO_ID,
    authToken: process.env.PILVO_KEY,
    sourceNumber: "9099"
};
exports.fast2SmsConfig = {
    authToken: process.env.FAST2SMS_TOKEN,
    url: process.env.FAST2SMS_URL,
    senderId: process.env.FAST2SMS_SENDERID
};
exports.testMessageConfig = {
    maxMessage: Number(process.env.MAX_TEST_MESSAGE),
    message: process.env.TEST_MESSAGE,
    devicePhone: process.env.TEST_MESSAGE_DEVICE_NUMBER
};
//# sourceMappingURL=index.js.map