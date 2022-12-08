export class DatabaseConfiguration {
  public username?: string = "postgresql";
  public password?: string = "postgres";
  public port?: number = 5432;
  public database?: string = "Bot";
  public logging?: boolean = false;
  public sync?: boolean = false;
}
