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
//import { googleOAuth } from '../../config/index'
const axios_1 = __importDefault(require("axios"));
//import jwkClient from 'jwks-rsa';
class SocialAuthenticator {
    getFacebookUserInfo(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield axios_1.default.get(`https://graph.facebook.com/me?fields=id,first_name,email,last_name&access_token=${token}`);
            data.given_name = data.first_name;
            data.family_name = data.last_name;
            data.picture = "https://polbol-media.s3.ap-south-1.amazonaws.com/ic_user_dummy.jpg";
            return data;
        });
    }
    // private appleClient = jwkClient({jwksUri: 'https://appleid.apple.com/auth/keys'});
    // private async getAppleSignInKeys(kid:string){
    //     return new Promise((resolve)=>{
    //         this.appleClient.getSigningKey(kid,(err,key)=>{
    //             if(err){
    //                 console.log('Error In Apple SingninKeys',err);
    //                 return resolve(null);
    //             }
    //             const signInKey = key.getPublicKey();
    //             return resolve(signInKey);
    //         })
    //     })
    // }
    // private verifyAppleJwt(token: any, publickey: any) {
    //     return new Promise((resolve) => {
    //         jwt.verify(token, publickey, (err: any, payload: any) => {
    //             if (err) {
    //                 console.log(err);
    //                 return resolve(null)
    //             }
    //             return resolve(payload);
    //         })
    //     })
    // }
    // public async verifyAppleUserInfo(body: any) {
    //     const token = body.identityToken;
    //     const userSub = body.user;
    //     const user = { given_name: body.givenName, family_name: body.familyName, id: body.user, picture: 'https://polbol-media.s3.ap-south-1.amazonaws.com/ic_user_dummy.jpg' }
    //     const json: any = jwt.decode(token, { complete: true });
    //     if (json && json.header) {
    //         const kid = json.header.kid;
    //         const appleKeys = await this.getAppleSignInKeys(kid);
    //         if (!appleKeys) {
    //             console.log('No appleKeys');
    //         }
    //         let data: any = await this.verifyAppleJwt(token, appleKeys);
    //         return (data && data.sub === userSub && data.aud === 'com.polbol.com') ? user : null;
    //     } else {
    //         return null;
    //     }
    // }
    // public urlGoogle() {
    //     const stringifiedParams = queryString.stringify({
    //         client_id: googleOAuth.CLIENT_ID,
    //         redirect_uri: googleOAuth.REDIRECT,
    //         scope: [
    //             'https://www.googleapis.com/auth/userinfo.email',
    //             'https://www.googleapis.com/auth/userinfo.profile',
    //         ].join(' '),
    //         response_type: 'code',
    //         access_type: 'offline',
    //         prompt: 'consent',
    //     });
    //     return `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;
    // }
    // private async getAccessTokenFromCode(code: string) {
    //     const { data } = await axios({
    //         url: `https://oauth2.googleapis.com/token`,
    //         method: 'post',
    //         data: {
    //             client_id: googleOAuth.CLIENT_ID,
    //             client_secret: googleOAuth.CLIENT_SECRET,
    //             redirect_uri: googleOAuth.REDIRECT,
    //             grant_type: 'authorization_code',
    //             code: code,
    //         },
    //     });
    //     return data.access_token;
    // };
    getGoogleUserInfo(access_token) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield (0, axios_1.default)({
                url: "https://www.googleapis.com/oauth2/v2/userinfo",
                method: "get",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });
            return data;
        });
    }
    ;
}
exports.default = new SocialAuthenticator();
//# sourceMappingURL=socialAuth.js.map