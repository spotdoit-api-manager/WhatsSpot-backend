"use strict";
/* eslint-disable @typescript-eslint/interface-name-prefix */
/* eslint-disable @typescript-eslint/no-use-before-define */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWhatsappButtonMessageType = exports.isWhatsappListMessageType = exports.isWhatsappTextMessageType = void 0;
//validate text message
exports.isWhatsappTextMessageType = (msg) => {
    if (!msg)
        return { valid: false, message: "Message is invalid" };
    if (!msg.text || typeof msg.text !== "string")
        return { valid: false, message: "Message Text is invalid" };
    return { valid: true };
};
//validate list message
exports.isWhatsappListMessageType = (msg) => {
    if (!msg)
        return { valid: false, message: "Message is invalid" };
    if (!msg.text || typeof msg.text !== "string")
        return { valid: false, message: "Message Text is invalid" };
    if (!msg.title || typeof msg.title !== "string")
        return { valid: false, message: "Message Title is invalid" };
    if (msg.footer && typeof msg.footer !== "string")
        return { valid: false, message: "Message footer is invalid" };
    if (!msg.sections || !Array.isArray(msg.sections))
        return { valid: false, message: "Message sections is invalid" };
    let isSectionValid = { valid: false, index: [], message: "" };
    msg.sections.forEach((section, index) => isSectionValid = validateSection(section, index));
    return isSectionValid;
};
const validateSection = (section, index) => {
    var _a;
    if (!section)
        return { valid: false, message: "Section has no data" };
    if (!section.title || typeof section.title !== "string")
        return { valid: false, message: "Section Title Text is invalid" };
    if (!section.rows || !Array.isArray(section.rows))
        return { valid: false, message: "Section rows is invalid" };
    let isRowValid = { valid: true, index: [] };
    section.rows.forEach((row, index) => isRowValid = validateRow(row, index));
    (_a = isRowValid.index) === null || _a === void 0 ? void 0 : _a.unshift(index);
    return isRowValid;
};
const validateRow = (row, index) => {
    if (!row)
        return { valid: false, message: "Row  is invalid", index: [index] };
    if (!row.title || typeof row.title !== "string")
        return { valid: false, message: "row title is invalid", index: [index] };
    if (!row.rowId || typeof row.rowId !== "string")
        return { valid: false, message: "rowId is invalid", index: [index] };
    if (row.description && typeof row.description !== "string")
        return { valid: false, message: "row description Text is invalid", index: [index] };
    return { valid: true, index: [], message: "" };
};
//validate button message
exports.isWhatsappButtonMessageType = (msg) => {
    if (!msg.text || typeof msg.text != "string")
        return { valid: false, message: "Message Text is invalid" };
    if (msg.footer && typeof msg.footer !== "string")
        return { valid: false, message: "Message Footer is invalid" };
    if (!msg.headerType || typeof msg.headerType != "number")
        return { valid: false, message: "Message headerType is invalid" };
    let isButtonValid = { valid: true };
    msg.buttons.forEach((button, index) => isButtonValid = validateButton(button, index));
    return isButtonValid;
};
const validateButton = (button, index) => {
    if (!button.buttonId || typeof button.buttonId !== "string")
        return { valid: false, message: "buttonId  is invalid", index: [index] };
    if (!button.buttonText || !button.buttonText.displayText || typeof button.buttonText.displayText !== "string")
        return { valid: false, message: "button Text is invalid", index: [index] };
    if (!button.type || typeof button.type !== "number")
        return { valid: false, message: "Button type is not invalid", index: [index] };
    return { valid: true };
};
//# sourceMappingURL=message.validator.js.map