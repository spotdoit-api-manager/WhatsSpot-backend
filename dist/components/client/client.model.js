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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinetModel = void 0;
const client_schema_1 = require("./client.schema");
class ClinetModel {
    addOrUpdateClient(phone, clientData) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("updaing client ", phone, clientData);
            if (!phone)
                return console.log("phone not provided in client update");
            //;{error:true,message:"phone not provided"};
            const options = { upsert: true, new: true, setDefaultsOnInsert: true };
            const client = yield client_schema_1.Client.findOneAndUpdate({ phone: phone }, Object.assign({}, clientData), options);
            if (!client)
                return { error: true, message: "some error occured" };
            return { error: false };
        });
    }
}
exports.ClinetModel = ClinetModel;
exports.default = new ClinetModel();
//# sourceMappingURL=client.model.js.map