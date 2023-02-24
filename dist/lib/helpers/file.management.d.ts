export declare class FileManagement {
    deleteFile(filePath: string): Promise<{
        error: boolean;
        message?: string;
    }>;
    deleteFolder(folderPath: string): Promise<{
        error: boolean;
        message?: string;
    }>;
    isFilePresent(filePath: string): Promise<boolean>;
}
declare const _default: FileManagement;
export default _default;
