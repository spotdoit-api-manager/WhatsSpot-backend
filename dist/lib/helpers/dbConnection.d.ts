declare class Connection {
    private mongoUrl;
    constructor(uri: string);
    mongoConnection(): void;
    protected mongoOption(): Object;
}
declare const _default: Connection;
export default _default;
