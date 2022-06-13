export class DatabaseConfiguration {
    public username?: string = null;
    public password?: string = null;
    public host?: string = null;
    public port?: string = null;
    public database?: string = null;
    public query?: { [key: string]: any } = {};
    public url?: string = null;
    public useDns?: boolean = false;
}