export declare const getRate: () => {};
export declare const startExchangeRateService: () => Promise<void>;
export declare const convertCurrency: (from: string, to: string, amount?: number) => Promise<number>;
