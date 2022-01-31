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
exports.FileManagement = void 0;
const fs_1 = __importDefault(require("fs"));
class FileManagement {
    deleteFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                try {
                    fs_1.default.unlink(`${filePath}`, () => {
                        resolve({ error: false });
                    });
                }
                catch (e) {
                    console.log("error in deleting file ", e);
                    resolve({ error: true, message: e.message });
                }
            });
        });
    }
}
exports.FileManagement = FileManagement;
exports.default = new FileManagement();
//# sourceMappingURL=file.management.js.map