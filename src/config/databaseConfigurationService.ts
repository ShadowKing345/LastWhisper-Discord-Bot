import { pino } from "pino";
import { singleton } from "tsyringe";

import { createLogger } from "../services/loggerService.js";
import { ProjectConfiguration, DatabaseConfiguration } from "../utils/objects/index.js";
import { ConfigurationClass } from "./configurationClass.js";
import { DataSource } from "typeorm";
import { BuffManagerEntities } from "../entities/buff_manager/index.js";
import { EventManagerEntities } from "../entities/event_manager/index.js";
import { GardeningManagerEntities } from "../entities/gardening_manager/index.js";
import { PermissionManagerEntities } from "../entities/permission_manager/index.js";
import { ManagerUtilsConfig } from "../entities/managerUtils.js";
import { RoleManagerConfig } from "../entities/roleManager.js";

/**
 * Database Configuration Service file.
 * This service provides access to the database object as well as connection to the database server.
 */
@singleton()
export class DatabaseConfigurationService extends ConfigurationClass {
  private _dataSource: DataSource = null;

  constructor(
    private projectConfig: ProjectConfiguration,
    @createLogger(DatabaseConfigurationService.name) private logger: pino.Logger,
  ) {
    super();
  }

  /**
   * Attempts to establish a connection to the database.
   */
  public async connect(): Promise<void> {
    const databaseConfigs: DatabaseConfiguration = this.projectConfig.database;

    if (!databaseConfigs) {
      throw new Error("Database configuration is null.");
    }

    try {
      this.logger.info(`Connecting to Database`);
      if (this.isConnected) {
        this.logger.error("Connection already active. Please disconnect first before attempting to connect.");
        return;
      }

      if (!this._dataSource) {
        this._dataSource = new DataSource({
          type: "postgres",
          username: databaseConfigs.username,
          password: databaseConfigs.password,
          port: Number(databaseConfigs.port),
          database: databaseConfigs.database,
          synchronize: databaseConfigs.sync,
          logging: databaseConfigs.logging,
          entities: [
            ...Object.values(BuffManagerEntities),
            ...Object.values(EventManagerEntities),
            ...Object.values(GardeningManagerEntities),
            ...Object.values(PermissionManagerEntities),
            ManagerUtilsConfig,
            RoleManagerConfig,
          ],
        });
      }

      await this._dataSource.initialize();
    } catch (error) {
      this.logger.error(error instanceof Error ? error.stack : error);
      this._dataSource = null;
    }
  }

  /**
   * Attempts to disconnect from the client.
   */
  public async disconnect(): Promise<void> {
    await this._dataSource.destroy();
    this._dataSource = null;
    this.logger.info("Disconnecting from database.");
  }

  /**
   * Returns an instance of the database.
   * If none exists attempt to create a new one from the client.
   * Assuming that fails or there is no client will return null instead.
   */
  public get dataSource(): DataSource {
    return this._dataSource;
  }

  /**
   * Returns if the database is connected to or not.
   */
  public get isConnected(): boolean {
    return this._dataSource?.isInitialized;
  }
}
