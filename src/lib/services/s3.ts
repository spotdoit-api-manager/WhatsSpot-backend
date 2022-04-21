import { S3 } from "aws-sdk";
import path from "path";
import multer from "multer";
import multerS3 from "multer-s3";
import { HTTP400Error } from "../utils/httpErrors";
import { s3Config } from "../../config";

// s3Config.accessKey,
// s3Config.secretKey,
// signatureVersion: s3Config.sign,
// s3Config.region
export const s3 = new S3({
  accessKeyId:"JKGJKHGJKGJGJHGJKHG",
  secretAccessKey:"JGU768GO87Y87OGH87G87G8/1uzG",
  region:"ap-south-1"
});
// export const s3 = new S3({
//   accessKeyId:s3Config.accessKey,
//   secretAccessKey:s3Config.secretKey,
//   region: s3Config.region
// });
// 'ikcplay-bucket'
export const s3UploadMulter = multer({
  storage: multerS3({
    s3:s3,
    bucket: "ikc-poll",
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req: any, file: any, cb: any) => {
      console.log(file);
      cb(null, Date.now().toString() + "-" + file.originalname);
    }
  })
});


interface IData {
  folder: string;
  key: string;
  ContentType: string;
  userId?: string;
}


const getSignedUrl = (Key: string, ContentType?: string) => {
  return new Promise((resolve, reject) => {
    s3.getSignedUrl("putObject", {
      Bucket: "polbol-images",
      ContentType: "multipart/form-data",
      Key
    }, (err, url) => {
      if (err) {
        reject(err);
      }
      console.log(url);
      resolve(url);
    });
  });
};


// Get sign url::
export const getSignUrl = async (data: IData) => {
  try {
    const { folder, key, ContentType, userId } = data;
    const Key: string = (userId ? `${folder}/${userId}-${new Date().getTime()}${path.extname(key)}` : `${folder}/${new Date().getTime()}${path.extname(key)}`);
    return { Key, url: await getSignedUrl(Key, ContentType) };
  } catch (e) {
    throw new HTTP400Error("This url has already been used", "Please create new url then try");
  }
};


