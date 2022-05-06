declare class Connection {
    private mongoUrl;
    constructor(uri: string);
    mongoConnection(): void;
    protected mongoOption(): Record<string, any>;
}
declare const _default: Connection;
export default _default;
