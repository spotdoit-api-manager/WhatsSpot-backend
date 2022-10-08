/* eslint-disable @typescript-eslint/no-this-alias */

import crypto from "crypto";
import * as chalk from "chalk";
import { paymentTemplate, responseTemplate } from "../../lib/utils/htmlTemplate";

const error = chalk.default.bold.yellow;

class PaymentHelpers {

    private crypt = {
        iv: "@@@@&&&&####$$$$",
        encrypt: function (data: any, custom_key: any) {
            const iv = this.iv;
            const key = custom_key;
            let algo = "256";
            switch (key.length) {
                case 16:
                    algo = "128";
                    break;
                case 24:
                    algo = "192";
                    break;
                case 32:
                    algo = "256";
                    break;

            }
            const cipher = crypto.createCipheriv("AES-" + algo + "-CBC", key, iv);
            //var cipher = crypto.createCipher('aes256',key);
            let encrypted = cipher.update(data, "binary", "base64");
            encrypted += cipher.final("base64");
            return encrypted;
        },

        decrypt: function (data: any, custom_key: any) {
            const iv = this.iv;
            const key = custom_key;
            let algo = "256";
            switch (key.length) {
                case 16:
                    algo = "128";
                    break;
                case 24:
                    algo = "192";
                    break;
                case 32:
                    algo = "256";
                    break;
            }
            const decipher = crypto.createDecipheriv("AES-" + algo + "-CBC", key, iv);
            let decrypted = decipher.update(data, "base64", "binary");
            try {
                decrypted += decipher.final("binary");
            } catch (e) {
                console.log(error(e));
            }
            return decrypted;
        },

        gen_salt: function (length: number, cb: any) {
            crypto.randomBytes((length * 3.0) / 4.0, function (err, buf) {
                let salt;
                if (!err) {
                    salt = buf.toString("base64");
                }
                //salt=Math.floor(Math.random()*8999)+1000;
                cb(err, salt);
            });
        },

        /* one way md5 hash with salt */
        md5sum: function (salt: any, data: any) {
            return crypto.createHash("md5").update(salt + data).digest("hex");
        },
        sha256sum: function (salt: any, data: any) {
            return crypto.createHash("sha256").update(data + salt).digest("hex");
        }
    };

    public paramsToString(params: any, mandatoryflag?: any) {
        let data = "";
        const tempKeys = Object.keys(params);
        tempKeys.sort();
        tempKeys.forEach(function (key) {
            const n = params[key].includes("REFUND");
            const m = params[key].includes("|");
            if (n == true) {
                params[key] = "";
            }
            if (m == true) {
                params[key] = "";
            }
            if (key !== "CHECKSUMHASH") {
                if (params[key] === "null") params[key] = "";
                if (!mandatoryflag) {
                    data += params[key] + "|";
                }
            }
        });
        return data;
    }

    public genchecksum(params: any, key: any, cb: any) {
        const data = this.paramsToString(params);
        const self = this;
        this.crypt.gen_salt(4, function (err: any, salt: number) {
            const sha256 = crypto
                .createHash("sha256")
                .update(data + salt)
                .digest("hex");
            const check_sum = sha256 + salt;
            const encrypted = self.crypt.encrypt(check_sum, key);
            cb(undefined, encrypted);
        });
    }

    public genchecksumbystring(params: any, key: any, cb: any) {
        const self = this;
        this.crypt.gen_salt(4, function (err: any, salt: number) {
            if (err) {
                console.log(error(err));
            } else {
                const sha256 = crypto.createHash("sha256").update(params + "|" + salt).digest("hex");
                const check_sum = sha256 + salt;
                const encrypted = self.crypt.encrypt(check_sum, key);
                let CHECKSUMHASH = encodeURIComponent(encrypted);
                CHECKSUMHASH = encrypted;
                cb(undefined, CHECKSUMHASH);
            }
        });
    }

    public verifychecksum(params: any, key: string, checksumhash: string) {
        const data = this.paramsToString(params, false);

        //TODO: after PG fix on thier side remove below two lines
        if (typeof checksumhash !== "undefined") {
            checksumhash = checksumhash.replace("\n", "");
            checksumhash = checksumhash.replace("\r", "");
            const temp = decodeURIComponent(checksumhash);
            const checksum = this.crypt.decrypt(temp, key);
            const salt = checksum.substr(checksum.length - 4);
            const sha256 = checksum.substr(0, checksum.length - 4);
            const hash = crypto
                .createHash("sha256")
                .update(data + salt)
                .digest("hex");
            if (hash === sha256) {
                return true;
            } else {
                console.log(error("Checksum is worng"));
                return false;
            }
        } else {
            console.log(error("Checksum is not found"));
            return false;
        }
    }

    public verifychecksumbystring(params: any, key: any, checksumhash: string) {

        const checksum = this.crypt.decrypt(checksumhash, key);
        const salt = checksum.substr(checksum.length - 4);
        const sha256 = checksum.substr(0, checksum.length - 4);
        const hash = crypto
            .createHash("sha256")
            .update(params + "|" + salt)
            .digest("hex");
        if (hash === sha256) {
            return true;
        } else {
            console.log(error("Checksum is worng"));
            return false;
        }
    }

    public genchecksumforrefund(params: any, key: string, cb: any) {
        const data = this.paramsToStringrefund(params);
        const self = this;
        this.crypt.gen_salt(4, function (err: any, salt: number) {
            const sha256 = crypto
                .createHash("sha256")
                .update(data + salt)
                .digest("hex");
            const check_sum = sha256 + salt;
            const encrypted = self.crypt.encrypt(check_sum, key);
            params.CHECKSUM = encodeURIComponent(encrypted);
            cb(undefined, params);
        });
    }

    public paramsToStringrefund(params: any, mandatoryflag?: any) {
        let data = "";
        const tempKeys = Object.keys(params);
        tempKeys.sort();
        tempKeys.forEach(function (key) {
            const m = params[key].includes("|");
            if (m == true) {
                params[key] = "";
            }
            if (key !== "CHECKSUMHASH") {
                if (params[key] === "null") params[key] = "";
                if (!mandatoryflag) {
                    data += params[key] + "|";
                }
            }
        });
        return data;
    }

    public paymentHTMLRender(final_url: string, formData: any): string {
        let formFields = "";
        for (const name in formData) {
            formFields += `<input name = "${name}" value="${formData[name]}" type="hidden"></input>`;
        }
        const html = paymentTemplate({ final_url: final_url, formFields: formFields });
        return html;
    }

    public responseHTMLRender(tableData: any): string {
        let tableFields = "";
        for (const name in tableData) {
            if (name == "CHECKSUMHASH" || name == "MID") {
                continue;
            }
            tableFields += `<tr>
            <td class="td-title">${name}</td>
            <td class="td-content">${tableData[name]}</td>
        </tr>`;
        }
        const html = responseTemplate(tableFields);
        return html;
    }
}

export default new PaymentHelpers();