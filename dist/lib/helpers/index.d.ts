/**
 * 4 digit otp generator.
 */
export declare const otpGenerator: () => number;
/**
 * **Crete new token**
 * ? This will create new jwt token for users every time.
 * @param user user Information here
 */
export declare const generateToken: (user: any) => Promise<string>;
/**
 * This will convert valid timestamp into h:m AM/PM date MonthName
 * ? for example::  10:47 PM 26 May
 * @param time Timestamp
 */
export declare const takeYMD: (time: string) => string;
export declare const imageUrl: (imgPath: string | string[]) => string | string[];
export declare const skipLimitOnPage: (page?: number) => {
    skip: number;
    limit: number;
};
export declare const getTime: (date: string) => string;
export declare const getNextDate: (day?: number) => Date;
export declare const isValidMongoId: (str: string) => RegExpMatchArray;
export declare const pruneFields: (body: any, fields: string) => void;
