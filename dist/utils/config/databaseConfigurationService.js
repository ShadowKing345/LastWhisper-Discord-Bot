var DatabaseConfigurationService_1;
import { __decorate, __metadata, __param } from "tslib";
import { pino } from "pino";
import { singleton } from "tsyringe";
import { createLogger } from "../loggerService.js";
import { ProjectConfiguration } from "../models/index.js";
import { ConfigurationClass } from "../configurationClass.js";
import { DataSource } from "typeorm";
import { BuffManagerEntities } from "../../entities/buff_manager/index.js";
let DatabaseConfigurationService = DatabaseConfigurationService_1 = class DatabaseConfigurationService extends ConfigurationClass {
    projectConfig;
    logger;
    _dataSource = null;
    constructor(projectConfig, logger) {
        super();
        this.projectConfig = projectConfig;
        this.logger = logger;
    }
    async connect() {
        const databaseConfigs = this.projectConfig.database;
        if (!databaseConfigs) {
            throw new Error("Database configuration is null.");
        }
        try {
            this.logger.info(`Connecting to Database`);
            if (this.isConnected) {
                this.logger.error("Connection already active. Please disconnect first before attempting to connect.");
                return;
            }
            this._dataSource = new DataSource({
                type: "postgres",
                username: databaseConfigs.username,
                password: databaseConfigs.password,
                port: Number(databaseConfigs.port),
                database: databaseConfigs.database,
                synchronize: databaseConfigs.sync,
                logging: databaseConfigs.logging,
                entities: [...Object.values(BuffManagerEntities)]
            });
            await this._dataSource.initialize();
        }
        catch (error) {
            this.logger.error(error instanceof Error ? error.stack : error);
            this._dataSource = null;
        }
    }
    async disconnect() {
        await this._dataSource.destroy();
        this._dataSource = null;
        this.logger.info("Disconnecting from database.");
    }
    get dataSource() {
        if (this._dataSource) {
            return this._dataSource;
        }
        return this._dataSource;
    }
    get isConnected() {
        return this._dataSource != null;
    }
};
DatabaseConfigurationService = DatabaseConfigurationService_1 = __decorate([
    singleton(),
    __param(1, createLogger(DatabaseConfigurationService_1.name)),
    __metadata("design:paramtypes", [ProjectConfiguration, Object])
], DatabaseConfigurationService);
export { DatabaseConfigurationService };
//# sourceMappingURL=databaseConfigurationService.js.map