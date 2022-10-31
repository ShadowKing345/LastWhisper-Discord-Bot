export class DatabaseConfiguration {
    public username?: string | null = null;
    public password?: string | null = null;
    public host?: string | null = null;
    public port?: string | null = null;
    public database?: string | null = null;
    public query?: { [key: string]: string } = {};
    public url?: string | null = null;
    public useDns?: boolean = false;
}