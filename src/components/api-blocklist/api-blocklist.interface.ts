/* eslint-disable @typescript-eslint/interface-name-prefix */
export interface IApiBlock{
    token: string;
    deviceId: string;
    createdOn: Date;
    expiresOn: Date;
    blockedOn: Date;
}