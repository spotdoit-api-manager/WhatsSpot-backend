import { PlivoCredentials, Fast2SmsCredentials } from './../lib/interfaces/providers.interface';
import { ITestMessageConfig } from './config.interface';
export const mongoUrl = (): string => {
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


export const configCors = {
  // Allow your domains to restrict ill apis.
  allowOrigin: [
    'http://localhost:3000',
    'http://127.0.0.1:5500',
    'http://localhost:4200',
    'https://spotdoit.in',
    'https://services.spotdoit.in',
    'https://services-console.spotdoit.in'

    //add your origin
  ],
  // Expose additional which are restricted.
  exposedHeaders: ["X-Auth", "Set-Cookie"]
};

export const rateLimitConfig = {
  inTime: process.env.REQUEST_TIME || 60 * 1000,
  maxRequest: process.env.MAX_REQUEST || 60
};

export const commonConfig = {
  jwtSecretKey: process.env.SECRET_KEY || "some-secret-key",
  pageSizeLimit: 15,
};

export const deviceKeyConfig = {
  jwtSecretKey: process.env.SECRET_KEY || "some-secret-key",
  expiresIn: process.env.JWT_EXPIRES_IN,
};


export const textLocalConfig = {
  apiKey: process.env.TEXTLOCAL_KEY
};

export const s3Config = {
  accessKey: process.env.S3_ACCEESS_ID || "",
  secretKey: process.env.S3_SECRET_KEY || "",
  sign: process.env.S3_SIGN_VERSION || 'v4',
  region: process.env.S3_REGION || "us-east-1",
  url: process.env.S3_URL || "",
};

export const paginationConfig = {
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



export const googleOAuth = {
  CLIENT_ID: '737333346336-s4mkj3ud2l79rug8tgg7u1u1231g6u94.apps.googleusercontent.com',
  CLIENT_SECRET: 'xOE1E9P46fTZo2Kwq6UsE7Rs',
  REDIRECT: 'http://ec2-13-235-90-125.ap-south-1.compute.amazonaws.com:2112/api/v1/user/login/socialAuth/google/callBack'
}

export const razorPaySecrets={
  key: process.env.RazorPay_KEY,
  secret:process.env.RazorPay_SECRET
}

export const pilvoConfig:PlivoCredentials = {
  authId:process.env.PILVO_ID,
  authToken:process.env.PILVO_KEY,
  sourceNumber:"9099"
}

export const fast2SmsConfig:Fast2SmsCredentials = {
  authToken: process.env.FAST2SMS_TOKEN,
  url: process.env.FAST2SMS_URL,
  senderId: process.env.FAST2SMS_SENDERID
}


export const testMessageConfig:ITestMessageConfig = {
  maxMessage:Number(process.env.MAX_TEST_MESSAGE),
  message:process.env.TEST_MESSAGE,
  devicePhone:process.env.TEST_MESSAGE_DEVICE_NUMBER
}