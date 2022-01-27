import walletController from "./wallet.controller";

export default [
    {
    path:"/wallet/fetchBalance",
    method:"get",
    escapeAuth:false,
    handler:[walletController.fetchBalance]    
    }
]