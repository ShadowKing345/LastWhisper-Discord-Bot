import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions.js";
export declare class DatabaseConfiguration implements PostgresConnectionOptions {
    readonly type = "postgres";
    username?: string;
    password?: string;
    port?: number;
    database?: string;
    logging?: boolean;
}
//# sourceMappingURL=databaseConfiguration.d.ts.map