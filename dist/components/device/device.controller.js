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
exports.DeviceController = void 0;
const responseHandler_1 = __importDefault(require("../../lib/helpers/responseHandler"));
const device_model_1 = __importDefault(require("./device.model"));
class DeviceController {
    constructor() {
        this.newDevice = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("new device request");
                responseHandler
                    .reqRes(req, res)
                    .onFetch("new device", yield device_model_1.default.newDevice(req.body, req.userId))
                    .send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.getQr = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("qr request");
                responseHandler.reqRes(req, res).onFetch("qr requestd", yield device_model_1.default.getQr(req.params)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.fetchAllDevices = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("fetch all device request");
                responseHandler.reqRes(req, res).onFetch("Devices fetched", yield device_model_1.default.fetchAllDevices(req.userId)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.fetchDevice = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("qr request");
                responseHandler.reqRes(req, res).onFetch("Devices fetched", yield device_model_1.default.fetchDevice(req.params.deviceId, req.userId)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.deleteAuth = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("qr request");
                responseHandler.reqRes(req, res).onFetch("auth deleted", yield device_model_1.default.deleteAuth(req.params)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.logoutDevice = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("qr request");
                responseHandler.reqRes(req, res).onFetch("auth deleted", yield device_model_1.default.logoutDevice(req.params)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.addMessageToQueue = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("qr request");
                responseHandler.reqRes(req, res).onFetch("added to queue", yield device_model_1.default.addMessageToQueue(req.body, req.params.deviceId)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.sendTextMessage = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("qr request");
                responseHandler.reqRes(req, res).onFetch("sent", yield device_model_1.default.sendTextMessage(req.body, req.params.deviceId)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
        this.sendImageMessage = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const responseHandler = new responseHandler_1.default();
            try {
                console.log("qr request");
                req.body.locationUrl = req.file.location;
                responseHandler.reqRes(req, res).onFetch("sent", yield device_model_1.default.sendImageMessage(req.body, req.params.deviceId)).send();
            }
            catch (e) {
                // send error with next function.
                next(responseHandler.sendError(e));
            }
        });
    }
}
exports.DeviceController = DeviceController;
exports.default = new DeviceController();
//# sourceMappingURL=device.controller.js.map