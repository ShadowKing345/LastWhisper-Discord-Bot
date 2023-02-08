var DatabaseService_1;
import { __decorate } from "tslib";
import { DatabaseConfiguration } from "./entities/index.js";
import { DataSource } from "typeorm";
import { Logger } from "./logger.js";
import { CommonConfigurationKeys } from "./configurationKeys.js";
import { ConfigurationService } from "./configurationService.js";
import { Lifecycle, scoped } from "tsyringe";
import path from "path";
let DatabaseService = DatabaseService_1 = class DatabaseService {
    static logger = new Logger("DatabaseService");
    _dataSource = null;
    async connect() {
        try {
            DatabaseService_1.logger.debug(`Connecting to Database`);
            if (this.isConnected) {
                DatabaseService_1.logger.error("Connection already active. Please disconnect first before attempting to connect.");
                return;
            }
            if (!this._dataSource) {
                this._dataSource = DatabaseService_1.createDataSource();
            }
            await this._dataSource.initialize();
        }
        catch (error) {
            DatabaseService_1.logger.error(error);
            this._dataSource = null;
        }
    }
    async disconnect() {
        if (!this._dataSource) {
            DatabaseService_1.logger.error("Database is not connected to.");
            return;
        }
        await this._dataSource?.destroy();
        this._dataSource = null;
        DatabaseService_1.logger.debug("Disconnecting from database.");
    }
    get dataSource() {
        return this._dataSource;
    }
    get isConnected() {
        if (this._dataSource) {
            return this._dataSource.isInitialized;
        }
        return false;
    }
    static createDataSource(config = ConfigurationService.getConfiguration(CommonConfigurationKeys.DATABASE, DatabaseConfiguration)) {
        const src = path.join(path.dirname(import.meta.url), "..");
        return new DataSource({
            type: config.type,
            username: config.username,
            password: config.password,
            port: config.port,
            database: config.database,
            logging: config.logging,
            entities: [path.join(src, "entities/**/*.[tj]s")],
            migrations: [path.join(src, "migrations/**/*.[tj]s")],
            migrationsTableName: "typeorm_migrations",
        });
    }
};
DatabaseService = DatabaseService_1 = __decorate([
    scoped(Lifecycle.ContainerScoped)
], DatabaseService);
export { DatabaseService };
//# sourceMappingURL=databaseService.js.map