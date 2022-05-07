import logger from "../../lib/utils/logger";
import { IApiKeyModal } from "../device/device.shema";
import { IApiBlock } from "./api-blocklist.interface";
import { ApiBlockList } from "./api-blocklist.schema";

const logFileName="[ApiBlocklistModel]";
export class ApiBlockListModel{
    public async addApiToBlockList(deviceId: string,apiDetails: IApiKeyModal){
        try{
            logger.debug("api details is ",apiDetails);
            
            const newApiBlockBody: IApiBlock = {token:apiDetails.token,deviceId,expiresOn:apiDetails.expiresOn,createdOn:apiDetails.createdOn,blockedOn:new Date()};
            const newApiBlock = new ApiBlockList(newApiBlockBody);
            await newApiBlock.addToList();
            logger.info(logFileName,apiDetails);
        }catch(e){
            logger.debug(e);
            throw new Error(e.message);
        }
    }
}

export default new ApiBlockListModel();