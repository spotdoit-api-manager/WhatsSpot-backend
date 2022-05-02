/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/interface-name-prefix */
/* eslint-disable @typescript-eslint/no-use-before-define */

export interface IIsValidMessageType {
  valid: boolean;
  message?: string;
  index?: number[];
}

//validate text message
export const isWhatsappTextMessageType = (msg: any): IIsValidMessageType => {
  if (!msg) return { valid: false, message: "Message is invalid" };
  if (!msg.text || typeof msg.text !== "string") return { valid: false, message: "message.text is invalid" };

  return { valid: true };
};

//validate list message
export const isWhatsappListMessageType = (msg: any): IIsValidMessageType => {
  if (!msg) return { valid: false, message: "Message is invalid" };
  if (!msg.text || typeof msg.text !== "string") return { valid: false, message: `message.text is missing/invalid` };
  if (!msg.title || typeof msg.title !== "string") return { valid: false, message: "message.title is missing/invalid" };
  if (msg.footer && typeof msg.footer !== "string") return { valid: false, message: "message.footer is missing/invalid" };
  if (!msg.sections || !Array.isArray(msg.sections)) return { valid: false, message: "message.sections are missing/invalid" };
  let isSectionValid: IIsValidMessageType = { valid: false, index: [], message: "message.sections is empty" };
  msg.sections.forEach((section: any, index: number) => isSectionValid = validateSection(section, index));
  return isSectionValid;
};


const validateSection = (section: any, index: number): IIsValidMessageType => {
  if (!section.title || typeof section.title !== "string") return { valid: false, message: `message.sections[${index}].title  is missing/invalid at index ${index}` };
  if (!section.rows || !Array.isArray(section.rows)) return { valid: false, message: `message.sections[${index}].rows are missing/invalid` };
  let isRowValid: IIsValidMessageType = { valid: false,message:`message.sections[${index}].rows is empty` ,index: [] };
  section.rows.forEach((row: any, rowIndex: number) => isRowValid = validateRow(row, rowIndex,index));
  isRowValid.index?.unshift(index);

  return isRowValid;
};


const validateRow = (row: any, index: number,sectionIndex: number): IIsValidMessageType => {
  if (!row) return { valid: false, message: "Row  is invalid", index: [index] };
  if (!row.title || typeof row.title !== "string") return { valid: false, message: `message.sections[${sectionIndex}].rows[${index}].title is missing/invalid`, index: [index] };
  if (!row.rowId || typeof row.rowId !== "string") return { valid: false, message: "rowId is missing/invalid", index: [index] };
  if (row.description && typeof row.description !== "string") return { valid: false, message: `message.sections[${sectionIndex}].rows[${index}].description is invalid`, index: [index] };
  return { valid: true, index: [], message: "" };
};


//validate button message
export const isWhatsappButtonMessageType = (msg: any): IIsValidMessageType => {
  if (!msg.text || typeof msg.text != "string") return { valid: false, message: "Message Text is invalid" };
  if (msg.footer && typeof msg.footer !== "string") return { valid: false, message: "Message Footer is invalid" };
  if (!msg.headerType || typeof msg.headerType != "number") return { valid: false, message: "Message headerType is invalid" };
  let isButtonValid = { valid: true };
  if(!msg.buttons || typeof msg.buttons!="object") return {valid:false,message:"Buttons field is missing/invalid"};
  msg.buttons.forEach((button: any, index: number) => isButtonValid = validateButton(button, index));
  return isButtonValid;
};


const validateButton = (button: any, index: number): IIsValidMessageType => {
  if (!button.buttonId || typeof button.buttonId !== "string") return { valid: false, message: `message.buttons[${index}].buttonId is missing/invalid`, index: [index] };
  if (!button.buttonText || !button.buttonText.displayText || typeof button.buttonText.displayText !== "string") return { valid: false, message: `message.buttons[${index}].buttonText.displayText is missing/invalid`, index: [index] };
  if (!button.type || typeof button.type !== "number") return { valid: false, message: `message.buttons[${index}].type is missing/invalid`, index: [index] };
  return { valid: true };
};
