var DatabaseService_1;
import { __decorate, __metadata, __param } from "tslib";
import { singleton, inject } from "tsyringe";
import { DataSource } from "typeorm";
import { BuffManagerEntities } from "../entities/buffManager/index.js";
import { EventManagerEntities } from "../entities/eventManager/index.js";
import { GardeningManagerEntities } from "../entities/gardeningManager/index.js";
import { PermissionManagerEntities } from "../entities/permissionManager/index.js";
import { ManagerUtilsConfig } from "../entities/managerUtils.js";
import { RoleManagerConfig } from "../entities/roleManager.js";
import { Logger } from "../utils/logger.js";
let DatabaseService = DatabaseService_1 = class DatabaseService {
    databaseConfigs;
    logger = new Logger(DatabaseService_1);
    _dataSource = null;
    constructor(databaseConfigs) {
        this.databaseConfigs = databaseConfigs.getValue();
    }
    async connect() {
        if (!this.databaseConfigs) {
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
                    username: this.databaseConfigs.username,
                    password: this.databaseConfigs.password,
                    port: this.databaseConfigs.port,
                    database: this.databaseConfigs.database,
                    synchronize: this.databaseConfigs.sync,
                    logging: this.databaseConfigs.logging,
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
        }
        catch (error) {
            this.logger.error(error instanceof Error ? error.stack : error);
            this._dataSource = null;
        }
    }
    async disconnect() {
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
};
DatabaseService = DatabaseService_1 = __decorate([
    singleton(),
    __param(0, inject("IOptional<DatabaseConfiguration>")),
    __metadata("design:paramtypes", [Object])
], DatabaseService);
export { DatabaseService };
//# sourceMappingURL=databaseService.js.map