"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.razorPaySecrets = exports.googleOAuth = exports.paginationConfig = exports.s3Config = exports.textLocalConfig = exports.deviceKeyConfig = exports.commonConfig = exports.rateLimitConfig = exports.configCors = exports.mongoUrl = void 0;
exports.mongoUrl = () => {
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
exports.configCors = {
    // Allow your domains to restrict ill apis.
    allowOrigin: [
        'http://localhost:3000',
        'http://127.0.0.1:5500',
        'http://localhost:4200'
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
};
exports.deviceKeyConfig = {
    jwtSecretKey: process.env.SECRET_KEY || "some-secret-key",
    expiresIn: process.env.JWT_EXPIRES_IN,
};
exports.textLocalConfig = {
    apiKey: process.env.TEXTLOCAL_KEY
};
exports.s3Config = {
    accessKey: process.env.S3_ACCEESS_ID || "",
    secretKey: process.env.S3_SECRET_KEY || "",
    sign: process.env.S3_SIGN_VERSION || 'v4',
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
    CLIENT_ID: '737333346336-s4mkj3ud2l79rug8tgg7u1u1231g6u94.apps.googleusercontent.com',
    CLIENT_SECRET: 'xOE1E9P46fTZo2Kwq6UsE7Rs',
    REDIRECT: 'http://ec2-13-235-90-125.ap-south-1.compute.amazonaws.com:2112/api/v1/user/login/socialAuth/google/callBack'
};
exports.razorPaySecrets = {
    key: process.env.RazorPay_KEY,
    secret: process.env.RazorPay_SECRET
};
//# sourceMappingURL=index.js.map