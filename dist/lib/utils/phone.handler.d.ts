import { CountryCode } from "libphonenumber-js/max";
export declare const parsePhoneWithCountry: (phone: string, country: CountryCode) => {
    number: import("libphonenumber-js/types.cjs").E164Number;
};
export declare const parsePhone: (phone: string) => {
    number: import("libphonenumber-js/types.cjs").E164Number;
};
