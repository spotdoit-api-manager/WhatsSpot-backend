"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const whatsapp_enum_1 = require("./../../lib/services/whatsapp/whatsapp.enum");
const mongoose_1 = require("mongoose");
const configSchema = new mongoose_1.Schema({
    testMessageType: {
        type: String,
        enum: Object.values(whatsapp_enum_1.EWhatsappMessageTypes),
        default: whatsapp_enum_1.EWhatsappMessageTypes.TEXT_MESSAGE
    }
});
const Configs = (0, mongoose_1.model)("configs", configSchema);
exports.default = Configs;
//# sourceMappingURL=configs.schema.js.map