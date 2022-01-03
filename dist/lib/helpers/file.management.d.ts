export declare class FileManagement {
    deleteFile(filePath: string): Promise<{
        error: boolean;
        message?: undefined;
    } | {
        error: boolean;
        message: any;
    }>;
}
declare const _default: FileManagement;
export default _default;
