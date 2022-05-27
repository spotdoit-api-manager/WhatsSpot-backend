import logger from "../utils/logger";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const CC = require("currency-converter-lt");
const FETCH_IN_EVRY=1;
const logFileName="[ExchangeRateService]: ";
const currencyConverter = new CC({from:"USD", to:"INR", amount:1, });
const rates={};


export const getRate = ()=>{
    return rates;
};

const fetchRate = ()=>{
    return new Promise((resolve)=>{
        currencyConverter.convert(1).then((response) => {
            rates["USD"] = response;
            resolve(response); //or do something else
        });
    });
};

const init =()=>{
    const fetchInterval = setInterval(() => {
        fetchRate();
    },FETCH_IN_EVRY*60 * 1000);
};
export const startExchangeRateService = async(): Promise<void> => {
    logger.info(logFileName, "Starting the Exchange Rate service... at every ", FETCH_IN_EVRY, " minutes");
   return new Promise<void>(async(resolve)=>{
   await fetchRate();//fetch rate on server starts
    resolve();
   });
};

