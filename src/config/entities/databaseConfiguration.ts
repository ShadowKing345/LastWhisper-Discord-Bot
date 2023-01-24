import { DatabaseType } from "typeorm";

export class DatabaseConfiguration {
    public type: DatabaseType = "postgres";
    public username?: string = "postgresql";
    public password?: string = "postgresql";
    public port?: number = 5432;
    public database?: string = "Bot";
    public logging?: boolean = false;
}