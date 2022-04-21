declare class SocialAuthenticator {
    getFacebookUserInfo(token: string): Promise<any>;
    getGoogleUserInfo(access_token: string): Promise<any>;
}
declare const _default: SocialAuthenticator;
export default _default;
