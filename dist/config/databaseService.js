import { DatabaseConfiguration } from "./entities/index.js";
import { DataSource } from "typeorm";
import { Logger } from "./logger.js";
import { CommonConfigurationKeys } from "./configurationKeys.js";
import { ConfigurationService } from "./configurationService.js";
export class DatabaseService {
    logger = new Logger(DatabaseService);
    _dataSource = null;
    async connect() {
        try {
            this.logger.info(`Connecting to Database`);
            if (this.isConnected) {
                this.logger.error("Connection already active. Please disconnect first before attempting to connect.");
                return;
            }
            if (!this._dataSource) {
                this._dataSource = AppDataSource;
            }
            await this._dataSource.initialize();
        }
        catch (error) {
            this.logger.error(error instanceof Error ? error.stack : error);
            this._dataSource = null;
        }
    }
    async disconnect() {
        if (!this._dataSource) {
            this.logger.error("Database is not connected to.");
            return;
        }
        await this._dataSource?.destroy();
        this._dataSource = null;
        this.logger.info("Disconnecting from database.");
    }
    get dataSource() {
        return this._dataSource;
    }
    get isConnected() {
        return this._dataSource?.isInitialized;
    }
    static createDataSource(config = ConfigurationService.getConfiguration(CommonConfigurationKeys.DATABASE, DatabaseConfiguration)) {
        return new DataSource({
            type: config.type,
            username: config.username,
            password: config.password,
            port: config.port,
            database: config.database,
            logging: config.logging,
            entities: ["./src/entities/**/*.ts"],
            migrations: ["./src/migrations/*.ts"],
        });
    }
}
export const AppDataSource = DatabaseService.createDataSource();
//# sourceMappingURL=databaseService.js.map