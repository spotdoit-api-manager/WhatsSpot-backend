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
exports.convertCurrency = exports.startExchangeRateService = exports.getRate = void 0;
const logger_1 = __importDefault(require("../../core/logger"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const CC = require("currency-converter-lt");
const FETCH_IN_EVRY = 1;
const logFileName = "[ExchangeRateService]: ";
const currencyConverter = new CC({ from: "USD", to: "INR", amount: 1, });
const rates = {};
exports.getRate = () => {
    return rates;
};
const fetchRate = () => {
    return new Promise((resolve) => {
        currencyConverter.convert(1).then((response) => {
            rates["USD"] = response;
            resolve(response); //or do something else
        });
    });
};
const init = () => {
    const fetchInterval = setInterval(() => {
        fetchRate();
    }, FETCH_IN_EVRY * 60 * 1000);
};
exports.startExchangeRateService = () => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info(logFileName, "Starting the Exchange Rate service... at every ", FETCH_IN_EVRY, " minutes");
    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        yield fetchRate(); //fetch rate on server starts
        resolve();
    }));
});
exports.convertCurrency = (from = "INR", to, amount = 1) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info(logFileName, "Converting ", amount, " ", from, " to ", to);
    const cc = new CC({ from, to, amount: 1, });
    if (rates[from] && rates[to]) {
        return amount * rates[to] / rates[from];
    }
    return cc.convert(amount);
});
exports.convertCurrency("INR", "USD", 1).then((res) => {
    console.log(res);
});
//# sourceMappingURL=exchange-rate.service.js.map