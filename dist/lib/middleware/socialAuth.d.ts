declare class socialAuthenticator {
    getFacebookUserInfo(token: string): Promise<any>;
    getGoogleUserInfo(access_token: string): Promise<any>;
}
declare const _default: socialAuthenticator;
export default _default;
