import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions.js";

export class DatabaseConfiguration implements PostgresConnectionOptions {
  public readonly type = "postgres";
  public username?: string = "postgresql";
  public password?: string = "postgresql";
  public host?: string = "127.0.0.1";
  public port?: number = 5432;
  public database?: string = "Bot";
}
