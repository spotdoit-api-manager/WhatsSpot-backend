"use strict";
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/interface-name-prefix */
/* eslint-disable @typescript-eslint/no-use-before-define */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWhatsappButtonMessageType = exports.isWhatsappListMessageType = exports.isWhatsappTextMessageType = void 0;
//validate text message
exports.isWhatsappTextMessageType = (msg) => {
    if (!msg)
        return { valid: false, message: "Message is invalid" };
    if (!msg.text || typeof msg.text !== "string")
        return { valid: false, message: "message.text is invalid" };
    return { valid: true };
};
//validate list message
exports.isWhatsappListMessageType = (msg) => {
    if (!msg)
        return { valid: false, message: "Message is invalid" };
    if (!msg.text || typeof msg.text !== "string")
        return { valid: false, message: `message.text is missing/invalid` };
    if (!msg.title || typeof msg.title !== "string")
        return { valid: false, message: "message.title is missing/invalid" };
    if (msg.footer && typeof msg.footer !== "string")
        return { valid: false, message: "message.footer is missing/invalid" };
    if (!msg.sections || !Array.isArray(msg.sections))
        return { valid: false, message: "message.sections are missing/invalid" };
    let isSectionValid = { valid: false, index: [], message: "message.sections is empty" };
    msg.sections.forEach((section, index) => isSectionValid = validateSection(section, index));
    return isSectionValid;
};
const validateSection = (section, index) => {
    var _a;
    if (!section.title || typeof section.title !== "string")
        return { valid: false, message: `message.sections[${index}].title  is missing/invalid at index ${index}` };
    if (!section.rows || !Array.isArray(section.rows))
        return { valid: false, message: `message.sections[${index}].rows are missing/invalid` };
    let isRowValid = { valid: false, message: `message.sections[${index}].rows is empty`, index: [] };
    section.rows.forEach((row, rowIndex) => isRowValid = validateRow(row, rowIndex, index));
    (_a = isRowValid.index) === null || _a === void 0 ? void 0 : _a.unshift(index);
    return isRowValid;
};
const validateRow = (row, index, sectionIndex) => {
    if (!row)
        return { valid: false, message: "Row  is invalid", index: [index] };
    if (!row.title || typeof row.title !== "string")
        return { valid: false, message: `message.sections[${sectionIndex}].rows[${index}].title is missing/invalid`, index: [index] };
    if (!row.rowId || typeof row.rowId !== "string")
        return { valid: false, message: "rowId is missing/invalid", index: [index] };
    if (row.description && typeof row.description !== "string")
        return { valid: false, message: `message.sections[${sectionIndex}].rows[${index}].description is invalid`, index: [index] };
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
    if (!msg.buttons || typeof msg.buttons != "object")
        return { valid: false, message: "Buttons field is missing/invalid" };
    msg.buttons.forEach((button, index) => isButtonValid = validateButton(button, index));
    return isButtonValid;
};
const validateButton = (button, index) => {
    if (!button.buttonId || typeof button.buttonId !== "string")
        return { valid: false, message: `message.buttons[${index}].buttonId is missing/invalid`, index: [index] };
    if (!button.buttonText || !button.buttonText.displayText || typeof button.buttonText.displayText !== "string")
        return { valid: false, message: `message.buttons[${index}].buttonText.displayText is missing/invalid`, index: [index] };
    if (!button.type || typeof button.type !== "number")
        return { valid: false, message: `message.buttons[${index}].type is missing/invalid`, index: [index] };
    return { valid: true };
};
//# sourceMappingURL=message.validator.js.map