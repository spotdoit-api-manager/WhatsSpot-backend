"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSignUrl = exports.s3UploadMulter = exports.s3 = void 0;
const aws_sdk_1 = require("aws-sdk");
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const httpErrors_1 = require("../utils/httpErrors");
// s3Config.accessKey,
// s3Config.secretKey,
// signatureVersion: s3Config.sign,
// s3Config.region
exports.s3 = new aws_sdk_1.S3({
    accessKeyId: "JKGJKHGJKGJGJHGJKHG",
    secretAccessKey: "JGU768GO87Y87OGH87G87G8/1uzG",
    region: "ap-south-1"
});
// export const s3 = new S3({
//   accessKeyId:s3Config.accessKey,
//   secretAccessKey:s3Config.secretKey,
//   region: s3Config.region
// });
// 'ikcplay-bucket'
exports.s3UploadMulter = multer_1.default({
    storage: multer_s3_1.default({
        s3: exports.s3,
        bucket: "ikc-poll",
        acl: "public-read",
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            console.log(file);
            cb(null, Date.now().toString() + "-" + file.originalname);
        }
    })
});
const getSignedUrl = (Key, ContentType) => {
    return new Promise((resolve, reject) => {
        exports.s3.getSignedUrl("putObject", {
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
exports.getSignUrl = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { folder, key, ContentType, userId } = data;
        const Key = (userId ? `${folder}/${userId}-${new Date().getTime()}${path_1.default.extname(key)}` : `${folder}/${new Date().getTime()}${path_1.default.extname(key)}`);
        return { Key, url: yield getSignedUrl(Key, ContentType) };
    }
    catch (e) {
        throw new httpErrors_1.HTTP400Error("This url has already been used", "Please create new url then try");
    }
});
//# sourceMappingURL=s3.js.map