"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/camelcase */
const crypto_1 = __importDefault(require("crypto"));
const chalk = __importStar(require("chalk"));
const htmlTemplate_1 = require("../../lib/utils/htmlTemplate");
const error = chalk.default.bold.yellow;
class PaymentHelpers {
    constructor() {
        this.crypt = {
            iv: "@@@@&&&&####$$$$",
            encrypt: function (data, custom_key) {
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
                const cipher = crypto_1.default.createCipheriv("AES-" + algo + "-CBC", key, iv);
                //var cipher = crypto.createCipher('aes256',key);
                let encrypted = cipher.update(data, "binary", "base64");
                encrypted += cipher.final("base64");
                return encrypted;
            },
            decrypt: function (data, custom_key) {
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
                const decipher = crypto_1.default.createDecipheriv("AES-" + algo + "-CBC", key, iv);
                let decrypted = decipher.update(data, "base64", "binary");
                try {
                    decrypted += decipher.final("binary");
                }
                catch (e) {
                    console.log(error(e));
                }
                return decrypted;
            },
            gen_salt: function (length, cb) {
                crypto_1.default.randomBytes((length * 3.0) / 4.0, function (err, buf) {
                    let salt;
                    if (!err) {
                        salt = buf.toString("base64");
                    }
                    //salt=Math.floor(Math.random()*8999)+1000;
                    cb(err, salt);
                });
            },
            /* one way md5 hash with salt */
            md5sum: function (salt, data) {
                return crypto_1.default.createHash("md5").update(salt + data).digest("hex");
            },
            sha256sum: function (salt, data) {
                return crypto_1.default.createHash("sha256").update(data + salt).digest("hex");
            }
        };
    }
    paramsToString(params, mandatoryflag) {
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
                if (params[key] === "null")
                    params[key] = "";
                if (!mandatoryflag) {
                    data += params[key] + "|";
                }
            }
        });
        return data;
    }
    genchecksum(params, key, cb) {
        const data = this.paramsToString(params);
        const self = this;
        this.crypt.gen_salt(4, function (err, salt) {
            const sha256 = crypto_1.default
                .createHash("sha256")
                .update(data + salt)
                .digest("hex");
            const check_sum = sha256 + salt;
            const encrypted = self.crypt.encrypt(check_sum, key);
            cb(undefined, encrypted);
        });
    }
    genchecksumbystring(params, key, cb) {
        const self = this;
        this.crypt.gen_salt(4, function (err, salt) {
            if (err) {
                console.log(error(err));
            }
            else {
                const sha256 = crypto_1.default.createHash("sha256").update(params + "|" + salt).digest("hex");
                const check_sum = sha256 + salt;
                const encrypted = self.crypt.encrypt(check_sum, key);
                let CHECKSUMHASH = encodeURIComponent(encrypted);
                CHECKSUMHASH = encrypted;
                cb(undefined, CHECKSUMHASH);
            }
        });
    }
    verifychecksum(params, key, checksumhash) {
        const data = this.paramsToString(params, false);
        //TODO: after PG fix on thier side remove below two lines
        if (typeof checksumhash !== "undefined") {
            checksumhash = checksumhash.replace("\n", "");
            checksumhash = checksumhash.replace("\r", "");
            const temp = decodeURIComponent(checksumhash);
            const checksum = this.crypt.decrypt(temp, key);
            const salt = checksum.substr(checksum.length - 4);
            const sha256 = checksum.substr(0, checksum.length - 4);
            const hash = crypto_1.default
                .createHash("sha256")
                .update(data + salt)
                .digest("hex");
            if (hash === sha256) {
                return true;
            }
            else {
                console.log(error("Checksum is worng"));
                return false;
            }
        }
        else {
            console.log(error("Checksum is not found"));
            return false;
        }
    }
    verifychecksumbystring(params, key, checksumhash) {
        const checksum = this.crypt.decrypt(checksumhash, key);
        const salt = checksum.substr(checksum.length - 4);
        const sha256 = checksum.substr(0, checksum.length - 4);
        const hash = crypto_1.default
            .createHash("sha256")
            .update(params + "|" + salt)
            .digest("hex");
        if (hash === sha256) {
            return true;
        }
        else {
            console.log(error("Checksum is worng"));
            return false;
        }
    }
    genchecksumforrefund(params, key, cb) {
        const data = this.paramsToStringrefund(params);
        const self = this;
        this.crypt.gen_salt(4, function (err, salt) {
            const sha256 = crypto_1.default
                .createHash("sha256")
                .update(data + salt)
                .digest("hex");
            const check_sum = sha256 + salt;
            const encrypted = self.crypt.encrypt(check_sum, key);
            params.CHECKSUM = encodeURIComponent(encrypted);
            cb(undefined, params);
        });
    }
    paramsToStringrefund(params, mandatoryflag) {
        let data = "";
        const tempKeys = Object.keys(params);
        tempKeys.sort();
        tempKeys.forEach(function (key) {
            const m = params[key].includes("|");
            if (m == true) {
                params[key] = "";
            }
            if (key !== "CHECKSUMHASH") {
                if (params[key] === "null")
                    params[key] = "";
                if (!mandatoryflag) {
                    data += params[key] + "|";
                }
            }
        });
        return data;
    }
    paymentHTMLRender(final_url, formData) {
        let formFields = "";
        for (const name in formData) {
            formFields += `<input name = "${name}" value="${formData[name]}" type="hidden"></input>`;
        }
        const html = (0, htmlTemplate_1.paymentTemplate)({ final_url: final_url, formFields: formFields });
        return html;
    }
    responseHTMLRender(tableData) {
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
        const html = (0, htmlTemplate_1.responseTemplate)(tableFields);
        return html;
    }
}
exports.default = new PaymentHelpers();
//# sourceMappingURL=paytm.helper.js.map