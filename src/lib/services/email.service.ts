// eslint-disable-next-line @typescript-eslint/no-var-requires
const  MailazyClient = require("mailazy-node");
import logger from "../../core/logger";
import { mailazyConfig } from "../../config";
import { HTTP400Error } from "../utils/httpErrors";

const logFileName="[EmailService]: ";


export const sendMail = async(to: string,subject: string,text: string,html: string="")=>{
    try {
        const client = new MailazyClient({ accessKey: mailazyConfig.accessKey, accessSecret: mailazyConfig.accessSecret });
        const res = await client.send({
            to,
            from: process.env.NOTIFICATION_EMAIL, 
            subject,
            text,
            html
        });
        logger.info(logFileName,`Email to ${to} sent successfully`,res);
    } catch (e) {
       logger.error(logFileName,`Error in sending mail to ${to}`,e);
    }
};


export const sendNotificationMail = async(to: string,subject: string,text: string,html: string="")=>{
    try {
        const client = new MailazyClient({ accessKey: mailazyConfig.accessKey, accessSecret: mailazyConfig.accessSecret });
        const res = await client.send({
            to,
            from: process.env.NOTIFICATION_EMAIL, 
            subject,
            text,
            html
        });
        logger.info(logFileName,`Email to ${to} sent successfully`,res);
    } catch (e) {
       logger.error(logFileName,`Error in sending mail to ${to}`,e);
    }
};



export const sendVerificationMail = async(to: string,subject: string,text: string="",html: string)=>{
    const client = new MailazyClient({ accessKey: mailazyConfig.accessKey, accessSecret: mailazyConfig.accessSecret });
    logger.info(logFileName,`Sending verification mail to ${to},html: ${html}`);
        let res = await client.send({
            to,
            from: process.env.NOTIFICATION_EMAIL, 
            subject,
            text,
            html
        });
        res= JSON.parse(res);
        if(res.error) throw new HTTP400Error("Email Error",res.message);

        logger.info(logFileName,`Email to ${to} sent successfully`,res);
        return res;
  
};
