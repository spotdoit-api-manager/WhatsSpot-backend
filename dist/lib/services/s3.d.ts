import { S3 } from "aws-sdk";
import multer from 'multer';
export declare const s3: S3;
export declare const s3UploadMulter: multer.Multer;
interface IData {
    folder: string;
    key: string;
    ContentType: string;
    userId?: string;
}
export declare const getSignUrl: (data: IData) => Promise<{
    Key: string;
    url: unknown;
}>;
export {};
