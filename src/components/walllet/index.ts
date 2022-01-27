import walletController from "./wallet.controller";

export default [
    {
        path: "/wallet/fetchBalance",
        method: "get",
        escapeAuth: false,
        handler: [walletController.fetchBalance]
    },
    {
        path: "/wallet/fetchTransactions",
        method: "get",
        escapeAuth: false,
        handler: [walletController.fetchTransactions]
    }
]