declare const logger: {
    info: (...msg: any) => void;
    error: (...msg: any) => void;
    warn: (...msg: any) => void;
    success: (...msg: any) => void;
};
export default logger;
