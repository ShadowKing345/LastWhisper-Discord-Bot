import { DatabaseConfiguration } from "./entities/index.js";
import { DataSource, DataSourceOptions } from "typeorm";
import { Logger } from "./logger.js";
import { CommonConfigurationKeys } from "./configurationKeys.js";
import { ConfigurationService } from "./configurationService.js";
import { Lifecycle, scoped } from "tsyringe";
import { AllEntities } from "../entities/index.js";

/**
 * Database Configuration Service file.
 * This service acts like a wrapper to the DataSource object that can be globally accessed.
 */
@scoped(Lifecycle.ContainerScoped)
export class DatabaseService {
  private readonly logger: Logger = new Logger(DatabaseService);
  private _dataSource: DataSource = null;

  /**
   * Attempts to establish a connection to the database.
   */
  public async connect(): Promise<void> {
    try {
      this.logger.info(`Connecting to Database`);
      if (this.isConnected) {
        this.logger.error("Connection already active. Please disconnect first before attempting to connect.");
        return;
      }

      if (!this._dataSource) {
        this._dataSource = DatabaseService.createDataSource();
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
    if (!this._dataSource) {
      this.logger.error("Database is not connected to.");
      return;
    }

    await this._dataSource?.destroy();
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

  /**
   * Attempts to create a new datasource to be used by throughout the project.
   * @param config Database configuration override.
   */
  public static createDataSource(config: DatabaseConfiguration = ConfigurationService.getConfiguration(CommonConfigurationKeys.DATABASE, DatabaseConfiguration)): DataSource {
    return new DataSource({
      type: config.type,
      username: config.username,
      password: config.password,
      port: config.port,
      database: config.database,
      logging: config.logging,
      entities: AllEntities,
    } as DataSourceOptions);
  }
}

export const AppDataSource = DatabaseService.createDataSource();

