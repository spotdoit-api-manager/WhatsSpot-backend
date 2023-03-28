import { EWhatsappMessageTypes } from "./../../lib/services/whatsapp/whatsapp.enum";
import { model, Schema } from "mongoose";

const configSchema  = new Schema({
    testMessageType: {
        type: String,
        enum: Object.values(EWhatsappMessageTypes),
        default:EWhatsappMessageTypes.TEXT_MESSAGE
    }
});

const Configs = model("configs", configSchema);


export default Configs;