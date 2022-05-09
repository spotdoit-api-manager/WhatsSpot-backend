"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTemplateMessage = exports.validateBtnMessage = exports.validateListMessage = exports.validateTextMessage = void 0;
const httpErrors_1 = require("../utils/httpErrors");
const message_validator_1 = require("../validators/message.validator");
const logger_1 = __importDefault(require("../../core/logger"));
const logFileName = "[MessageMiddleware]";
exports.validateTextMessage = (req, res, next) => {
    const message = req.body.message;
    const valid = message_validator_1.isWhatsappTextMessageType(message);
    if (valid.valid) {
        next();
    }
    else {
        throw new httpErrors_1.HTTP401Error(valid.message, "Please check provided message format is valid");
    }
};
exports.validateListMessage = (req, res, next) => {
    var _a, _b, _c;
    (_c = (_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.sections) === null || _c === void 0 ? void 0 : _c.forEach((section, sectionIndex) => {
        var _a;
        (_a = section === null || section === void 0 ? void 0 : section.rows) === null || _a === void 0 ? void 0 : _a.forEach((row, rowIndex) => {
            row.rowId = `r${sectionIndex}${rowIndex}`;
        });
    });
    const message = req.body.message;
    const valid = message_validator_1.isWhatsappListMessageType(message);
    if (valid.valid) {
        next();
    }
    else {
        throw new httpErrors_1.HTTP401Error(valid.message, "Please check provided message format is valid");
    }
};
exports.validateBtnMessage = (req, res, next) => {
    var _a, _b, _c;
    req.body.message.headerType = 1;
    (_c = (_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.buttons) === null || _c === void 0 ? void 0 : _c.forEach((button, btnIndex) => {
        button.type = 1;
        button.buttonId = `btn${btnIndex}`;
    });
    const message = req.body.message;
    logger_1.default.info(logFileName, message);
    const valid = message_validator_1.isWhatsappButtonMessageType(message);
    if (valid.valid) {
        next();
    }
    else {
        throw new httpErrors_1.HTTP401Error(valid.message, "Please check provided message format is valid");
    }
};
exports.validateTemplateMessage = (req, res, next) => {
    req.body.message.templateButtons.forEach((button, index) => {
        button.index = index;
    });
    const message = req.body.message;
    logger_1.default.info(message);
    const valid = message_validator_1.isWhatsappTemplateMessageType(message);
    if (valid.valid) {
        next();
    }
    else {
        throw new httpErrors_1.HTTP401Error(valid.message, "Please check provided message format is valid");
    }
};
//# sourceMappingURL=message.middleware.js.map